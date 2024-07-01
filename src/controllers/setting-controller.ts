import { Request, Response } from 'express';

import { SETTINGS } from '@/entity-schema/setting-schema'; // Adjust the import path as necessary
import { settingsService } from '@/service/setting-service';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';

class SettingsController {
  
  async createSetting(req: Request, res: Response) {
    try {
      const setting = await settingsService.createSetting(req.body);
      successResponse(setting, res);
    } catch (error: any) {
        errorResponseFromError(error, res);
    }
  }

  async getSetting(req: Request, res: Response) {
    try {
      const code = req.params.code as SETTINGS;
      const setting = await settingsService.getSetting(code);
      successResponse(setting, res);
    } catch (error: any) {
        errorResponseFromError(error, res);
    }
  }

  
  async partialUpdateSetting(req: Request, res: Response) {
    try {
      const code = req.params.code as SETTINGS;
      const updatedSetting = await settingsService.partialUpdateSetting(code, req.body);
      successResponse(updatedSetting, res);
    } catch (error: any) {
      errorResponseFromError(error, res);
    }
  }

  async updateSetting(req: Request, res: Response) {
    try {
      const code = req.params.code as SETTINGS;
      const updatedSetting = await settingsService.updateSetting(code, req.body);
      successResponse(updatedSetting, res);
    } catch (error: any) {
        errorResponseFromError(error, res);
    }
  }

  async deleteSetting(req: Request, res: Response) {
    try {
      const code = req.params.code as SETTINGS;
      const result = await settingsService.deleteSetting(code);
      successResponse(result, res);
    } catch (error: any) {
        errorResponseFromError(error, res);
    }
  }

  async listSettings(req: Request, res: Response) {
    try {
      const settings = await settingsService.listSettings(req.query);
      successResponse(settings, res, {message: "Setting fetched successfully!"});
    } catch (error: any) {
        errorResponseFromError(error, res);
    }
  }
}

export const settingsController = new SettingsController();
