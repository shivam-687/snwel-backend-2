"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationEmail = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const baseUrl = 'https://example.com';
const JobApplicationEmail = ({ applicantName, jobTitle, companyName, contactEmail, careersPageUrl, senderName, senderJobTitle, companyContactInfo, companyWebsite, companyLogo }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null,
            "Thank you for your application to ",
            companyName),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Img, { src: companyLogo, width: "170", height: "50", alt: `${companyName} Logo`, style: logo }),
                React.createElement(components_1.Heading, { style: h1 }, "Application Received"),
                React.createElement(components_1.Text, { style: text },
                    "Dear ",
                    applicantName,
                    ","),
                React.createElement(components_1.Text, { style: text },
                    "Thank you for submitting your application for the ",
                    React.createElement("strong", null, jobTitle),
                    " position at ",
                    companyName,
                    ". We appreciate your interest in joining our team!"),
                React.createElement(components_1.Text, { style: text }, "Our hiring team is currently reviewing your application and qualifications. If your profile matches our requirements, we will be in touch to schedule the next steps in the hiring process, such as an interview."),
                React.createElement(components_1.Text, { style: text }, "Please note, due to the high volume of applications, it may take some time to process all submissions. Rest assured, we will keep you updated on the status of your application."),
                React.createElement(components_1.Text, { style: text },
                    "If you have any questions in the meantime, feel free to reach out to us at",
                    ' ',
                    React.createElement(components_1.Link, { href: `mailto:${contactEmail}`, style: link }, contactEmail),
                    ' ',
                    "or visit our",
                    ' ',
                    React.createElement(components_1.Link, { href: careersPageUrl, style: link }, "careers page"),
                    ' ',
                    "for more information."),
                React.createElement(components_1.Text, { style: text },
                    "Thank you once again for considering ",
                    companyName,
                    " as your next career move. We look forward to reviewing your application."),
                React.createElement(components_1.Text, { style: text }, "Best regards,"),
                React.createElement(components_1.Text, { style: signature },
                    senderName,
                    React.createElement("br", null),
                    senderJobTitle,
                    React.createElement("br", null),
                    companyName),
                React.createElement(components_1.Hr, { style: hr }),
                React.createElement(components_1.Text, { style: footer },
                    companyContactInfo,
                    React.createElement("br", null),
                    React.createElement(components_1.Link, { href: companyWebsite, style: link }, companyWebsite))))));
};
exports.JobApplicationEmail = JobApplicationEmail;
exports.default = exports.JobApplicationEmail;
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};
const logo = {
    margin: '0 auto 24px',
    display: 'block',
};
const h1 = {
    color: '#1e88e5',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0',
    padding: '0',
    lineHeight: '1.4',
};
const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 20px',
    padding: '0 40px',
};
const link = {
    color: '#1e88e5',
    textDecoration: 'underline',
};
const signature = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 20px',
    padding: '0 40px',
    fontStyle: 'italic',
};
const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};
const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center',
    margin: '0',
};
