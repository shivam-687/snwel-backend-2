import { GeneralSettingData, SETTINGS } from "@/entity-schema/setting-schema"
import { SettingModel } from "@/models/Setting"
import { render } from "@react-email/render";
import OTPEmailTemplate from "./otpEmail";
import React from "react";

const template = async () => {
    const setting = await SettingModel.findOne({type : SETTINGS.GENERAL});
    const settingData = setting?.data as GeneralSettingData;

}

export const otpEmailTemplate = async (otp: string) => {
    const setting = await SettingModel.findOne({code : SETTINGS.GENERAL});
    const settingData = setting?.data as GeneralSettingData;
    const footerText = `© 2023 ${settingData?.siteName}. All rights reserved.`
    return{
        template:  render(<OTPEmailTemplate otpCode={otp} logoUrl={settingData?.logoUrl||''} footerText={footerText} />),
        subject: `Your OTP Code: ${otp} - Complete Your Verification`
    }
}
