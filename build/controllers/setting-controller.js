"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsController = void 0;
const setting_service_1 = require("../service/setting-service");
const appResponse_1 = require("../utils/helpers/appResponse");
class SettingsController {
    async createSetting(req, res) {
        try {
            const setting = await setting_service_1.settingsService.createSetting(req.body);
            (0, appResponse_1.successResponse)(setting, res);
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    }
    async getSetting(req, res) {
        try {
            const code = req.params.code;
            const setting = await setting_service_1.settingsService.getSetting(code);
            (0, appResponse_1.successResponse)(setting, res);
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    }
    async partialUpdateSetting(req, res) {
        try {
            const code = req.params.code;
            const updatedSetting = await setting_service_1.settingsService.partialUpdateSetting(code, req.body);
            (0, appResponse_1.successResponse)(updatedSetting, res);
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    }
    async updateSetting(req, res) {
        try {
            const code = req.params.code;
            const updatedSetting = await setting_service_1.settingsService.updateSetting(code, req.body);
            (0, appResponse_1.successResponse)(updatedSetting, res);
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    }
    async deleteSetting(req, res) {
        try {
            const code = req.params.code;
            const result = await setting_service_1.settingsService.deleteSetting(code);
            (0, appResponse_1.successResponse)(result, res);
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    }
    async listSettings(req, res) {
        try {
            const settings = await setting_service_1.settingsService.listSettings(req.query);
            (0, appResponse_1.successResponse)(settings, res, { message: "Setting fetched successfully!" });
        }
        catch (error) {
            (0, appResponse_1.errorResponseFromError)(error, res);
        }
    }
}
exports.settingsController = new SettingsController();
