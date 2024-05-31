import { convertToPagination } from './../utils/helpers/index';
import { CreateSettingInput, EmailSettingTypeSchema, GeneralSettingSchema, IntegrationSettingTypeSchema, SETTINGS, Setting, UpdateSettingInput } from '@/entity-schema/setting-schema';
import { SettingModel } from '@/models/Setting';
import { ListOptions, PaginatedList } from '@/types/custom';
import { getPaginationParams } from '@/utils/helpers';

class SettingsService {
  
  async createSetting<T>(input: CreateSettingInput<T>) {
    const exist = await SettingModel.findOne({ code: input.code });
    if(exist)throw new Error("Setting already exists");

    let validatedInput;
    switch (input.code) {
      case SETTINGS.INTEGRATION:
        validatedInput = IntegrationSettingTypeSchema.parse(input);
        break;
      case SETTINGS.EMAIL:
        validatedInput = EmailSettingTypeSchema.parse(input);
        break;
      case SETTINGS.GENERAL:
        validatedInput = GeneralSettingSchema.parse(input);
        break;
      default:
        throw new Error('Invalid setting code');
    }
    
    // Save to database
    const setting = new SettingModel(validatedInput);
    await setting.save();
    return setting;
  }

  async getSetting(code: SETTINGS) {
    const setting = await SettingModel.findOne({ code });
    if (!setting) {
      throw new Error(`Setting with code ${code} not found`);
    }
    return setting;
  }

  async updateSetting<T>(code: SETTINGS, input: UpdateSettingInput<T>) {
    // Validate input
    let validatedInput;
    switch (code) {
      case SETTINGS.INTEGRATION:
        validatedInput = IntegrationSettingTypeSchema.pick({ data: true, isChangable: true }).parse(input);
        break;
      case SETTINGS.EMAIL:
        validatedInput = EmailSettingTypeSchema.pick({ data: true, isChangable: true }).parse(input);
        break;
      case SETTINGS.GENERAL:
        validatedInput = GeneralSettingSchema.pick({ data: true, isChangable: true }).parse(input);
        break;
      default:
        throw new Error('Invalid setting code');
    }

    // Update in database
    const updatedSetting = await SettingModel.findOneAndUpdate({ code }, validatedInput, { new: true });
    if (!updatedSetting) {
      throw new Error(`Setting with code ${code} not found`);
    }
    return updatedSetting;
  }

  
  async partialUpdateSetting<T>(code: SETTINGS, input: Partial<UpdateSettingInput<T>>) {
    const existingSetting = await SettingModel.findOne({ code });
    if (!existingSetting) {
      throw new Error(`Setting with code ${code} not found`);
    }

    // Merge existing data with new input data
    const newData = { ...existingSetting.data, ...input.data };
    const updatedSetting = await SettingModel.findOneAndUpdate(
      { code },
      { data: newData, isChangable: input.isChangable ?? existingSetting.isChangable },
      { new: true }
    );

    if (!updatedSetting) {
      throw new Error(`Setting with code ${code} not found`);
    }

    return updatedSetting;
  }

  async deleteSetting(code: SETTINGS) {
    const result = await SettingModel.deleteOne({ code });
    if (result.deletedCount === 0) {
      throw new Error(`Setting with code ${code} not found`);
    }
    return { message: `Setting with code ${code} deleted successfully` };
  }

  async listSettings(options: ListOptions):Promise<PaginatedList<Setting>> {
    try {
        const { limit = 10, page = 1, filter } = options;
        const query: any = {}; 
        const paginationData = getPaginationParams(limit, page)
        if (filter && filter.search) {
          const searchRegex = new RegExp(filter.search, 'i');
          query.$or = [{ name: searchRegex }, { email: searchRegex }];
        }
      
        const skip = (page - 1) * limit;
        const users = await SettingModel.find(query).skip(skip).limit(limit);
        const count = await SettingModel.countDocuments(query);
        return convertToPagination(users, count, paginationData.limit, paginationData.offset);
    } catch (error: any) {
        throw new Error(`Error: retrieving settings: ${error.message}`);
    }
  }
}

export const settingsService = new SettingsService();
