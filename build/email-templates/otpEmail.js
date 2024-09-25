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
exports.OTPEmailTemplate = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const OTPEmailTemplate = ({ otpCode = '123456', footerText = "20265 Snwel Academy", logoUrl }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "Your One-Time Password (OTP)"),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Img, { src: logoUrl, width: "150", height: "50", alt: "Company Logo", style: logo }),
                React.createElement(components_1.Heading, { style: h1 }, "Your One-Time Password"),
                React.createElement(components_1.Text, { style: text }, "Use the following OTP to complete your action. This code will expire in 10 minutes."),
                React.createElement(components_1.Section, { style: codeContainer },
                    React.createElement(components_1.Text, { style: code }, otpCode)),
                React.createElement(components_1.Text, { style: text }, "If you didn't request this code, please ignore this email."),
                React.createElement(components_1.Text, { style: footer },
                    "This is an automated message, please do not reply to this email.",
                    React.createElement("br", null),
                    React.createElement("br", null),
                    footerText,
                    ". All rights reserved.")))));
};
exports.OTPEmailTemplate = OTPEmailTemplate;
exports.default = exports.OTPEmailTemplate;
const main = {
    backgroundColor: '#f4f4f4',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};
const logo = {
    margin: '0 auto',
    marginBottom: '24px',
};
const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0',
};
const text = {
    color: '#666',
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center',
};
const codeContainer = {
    background: '#f0f7ff',
    border: '2px dashed #3498db',
    borderRadius: '4px',
    margin: '16px auto',
    width: '280px',
    padding: '16px',
};
const code = {
    color: '#3498db',
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '6px',
    lineHeight: '40px',
    textAlign: 'center',
};
const footer = {
    color: '#999',
    fontSize: '12px',
    lineHeight: '24px',
    textAlign: 'center',
    marginTop: '40px',
};
