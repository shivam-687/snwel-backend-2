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
exports.CourseInquiryEmail = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const CourseInquiryEmail = ({ userName, courseTitle, courseDuration, difficulty, languages, price, currency, discount, certificateAvailable, trainingModes, supportEmail, phoneNumber, companyName, websiteUrl, logoUrl }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null,
            "Inquiry Received for ",
            courseTitle,
            " - Thank You!"),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Img, { src: logoUrl, width: "150", height: "50", alt: `${companyName} Logo`, style: logo }),
                React.createElement(components_1.Heading, { style: h1 },
                    "Inquiry Received for ",
                    courseTitle),
                React.createElement(components_1.Text, { style: text },
                    "Dear ",
                    userName,
                    ","),
                React.createElement(components_1.Text, { style: text },
                    "Thank you for your interest in our course \"",
                    courseTitle,
                    "\". We're excited to provide you with more information!"),
                React.createElement(components_1.Section, { style: courseDetails },
                    React.createElement(components_1.Heading, { as: "h2", style: h2 }, "Course Details:"),
                    React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Duration:"),
                        " ",
                        courseDuration),
                    React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Difficulty:"),
                        " ",
                        difficulty || 'N/A'),
                    React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Language(s):"),
                        " ",
                        languages || 'N/A'),
                    React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Price:"),
                        " ",
                        price,
                        " ",
                        currency),
                    discount && (React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Discounts:"),
                        " ",
                        discount || 'N/A')),
                    React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Certificate:"),
                        " ",
                        certificateAvailable ? 'Yes' : 'No'),
                    React.createElement(components_1.Text, { style: detailItem },
                        React.createElement("strong", { style: detailLabel }, "Training Mode:"),
                        " ",
                        trainingModes || 'N/A')),
                React.createElement(components_1.Text, { style: text }, "If you have any questions, please reply to this email or contact our support team:"),
                React.createElement(components_1.Section, { style: buttonContainer },
                    React.createElement(components_1.Link, { href: `mailto:${supportEmail}`, style: button }, "Contact Support")),
                React.createElement(components_1.Text, { style: text }, "We'll get back to you shortly with more information to address all your queries."),
                React.createElement(components_1.Text, { style: text },
                    "Best regards,",
                    React.createElement("br", null),
                    companyName,
                    " Team")),
            React.createElement(components_1.Container, { style: footer },
                React.createElement(components_1.Link, { href: websiteUrl, style: footerLink }, websiteUrl),
                React.createElement(components_1.Text, { style: footerText },
                    supportEmail,
                    " | ",
                    phoneNumber)))));
};
exports.CourseInquiryEmail = CourseInquiryEmail;
exports.default = exports.CourseInquiryEmail;
const main = {
    backgroundColor: '#f0f4f8',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
    margin: '0 auto',
    padding: '20px 20px 20px 48px',
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};
const logo = {
    margin: '0 auto 24px',
    display: 'block',
};
const h1 = {
    color: '#2196F3',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0',
    padding: '0',
    lineHeight: '1.4',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
};
const h2 = {
    color: '#4CAF50',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 20px',
    padding: '0',
    lineHeight: '1.4',
};
const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 20px',
};
const courseDetails = {
    background: 'linear-gradient(to bottom right, #E8F5E9, #E3F2FD)',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '24px',
};
const detailItem = {
    margin: '0 0 10px',
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
};
const detailLabel = {
    color: '#2196F3',
    fontWeight: 'bold',
};
const buttonContainer = {
    textAlign: 'center',
    margin: '0 0 20px',
};
const button = {
    backgroundColor: '#F44336',
    borderRadius: '5px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '1',
    padding: '12px 25px',
    textDecoration: 'none',
    textAlign: 'center',
};
const footer = {
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    padding: '30px 40px',
};
const footerLink = {
    color: '#4CAF50',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
};
const footerText = {
    color: '#666',
    fontSize: '14px',
    lineHeight: '21px',
    margin: '10px 0 0',
    textAlign: 'center',
};
