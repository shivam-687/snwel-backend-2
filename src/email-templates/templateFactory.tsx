import { GeneralSettingData, SETTINGS } from "@/entity-schema/setting-schema"
import { SettingModel } from "@/models/Setting"
import { render } from "@react-email/render";
import OTPEmailTemplate from "./otpEmail";
import React from "react";
import { Course } from "@/models/CourseModel";
import CourseInquiryEmail, { CourseInquiryEmailProps } from "./course-email-template/course-inquiry";
import { IJobApplication } from "@/models/JobApplicationModel";
import JobApplicationEmail, { JobApplicationEmailProps } from "./job/job-apply-confirm";
import { JobVacancy } from "@/models/JobVacancy";
import { CommonConfig } from "@/config/common";

const template = async () => {
    const setting = await SettingModel.findOne({ type: SETTINGS.GENERAL });
    const settingData = setting?.data as GeneralSettingData;

}

export const otpEmailTemplate = async (otp: string) => {
    const setting = await SettingModel.findOne({ code: SETTINGS.GENERAL });
    const settingData = setting?.data as GeneralSettingData;
    const footerText = `© 2023 ${settingData?.siteName}. All rights reserved.`
    return {
        template: render(<OTPEmailTemplate otpCode={otp} logoUrl={settingData?.logoUrl || ''} footerText={footerText} />),
        subject: `Your OTP Code: ${otp} - Complete Your Verification`
    }
}

export const courseEnquiryTemplate = async (course: Course, userName: string) => {
    const setting = await SettingModel.findOne({ code: SETTINGS.GENERAL });
    const settingData = setting?.data as GeneralSettingData;
    const footerText = `© 2023 ${settingData?.siteName}. All rights reserved.`;

    const data: CourseInquiryEmailProps = {
        userName: userName, // This should be filled with the user's name making the inquiry
        courseTitle: course.title,
        courseDuration: course.courseDuration,
        difficulty: course.difficulty,
        languages: course.language.join(", "), // Joining the array into a comma-separated string
        price: course.price.toString(), // Ensure price is a string
        currency: course.currency,
        discount: course.discount?.toString() || "", // Optional field
        certificateAvailable: course.certificate ? 'Yes' : 'No',
        trainingModes: course.trainingModes.join(", "), // Assuming these are string types or you need to resolve ObjectId to names
        supportEmail: settingData?.senderEmail || "", // This should come from your general settings or some config
        phoneNumber: settingData?.contacts?.phone || "",  // Same for phone number
        companyName: settingData?.siteName || "", // From settings
        websiteUrl: CommonConfig.FRONT_URL || "", // From settings
        logoUrl: settingData?.logoUrl || "" // From settings
    };

    return {
        template: render(
            <CourseInquiryEmail
                courseTitle={data.courseTitle}
                courseDuration={data.courseDuration}
                difficulty={data.difficulty}
                languages={data.languages}
                price={data.price}
                currency={data.currency}
                discount={data.discount}
                certificateAvailable={data.certificateAvailable}
                trainingModes={data.trainingModes}
                supportEmail={data.supportEmail}
                phoneNumber={data.phoneNumber}
                companyName={data.companyName}
                websiteUrl={data.websiteUrl}
                logoUrl={data.logoUrl}
                userName={data.userName}
            />
        ),
        subject: `Your Enrollment for ${data.courseTitle} is Almost Complete – Our Team Will Reach Out Soon`,
        footer: footerText
    };
};


export const jobApplyConfirmTemplate = async (jobApplication: IJobApplication) => {
    const setting = await SettingModel.findOne({ code: SETTINGS.GENERAL });
    const settingData = setting?.data as GeneralSettingData;
    const footerText = `© 2023 ${settingData?.siteName}. All rights reserved.`;
    const job = jobApplication.jobId as unknown as JobVacancy
    const data: JobApplicationEmailProps = {
        applicantName: jobApplication.applicantName,
        jobTitle: job.title,
        companyName: job.companyName||settingData.siteName,
        contactEmail: settingData.contacts?.email||'N/A',
        careersPageUrl: CommonConfig.FRONT_URL+"/job-vacancies",
        senderName: settingData.siteName,
        senderJobTitle: "N/A",
        companyContactInfo: job.contactInfo,
        companyWebsite: job.applicationLink||CommonConfig.FRONT_URL,
        companyLogo: settingData.logoUrl||""
    }

    return {
        template: render(<JobApplicationEmail {...data} />),
        subject: `Thank You for Applying to ${data.jobTitle} at ${data.companyName}!`,
        footer: footerText
    };
}
