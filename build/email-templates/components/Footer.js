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
exports.Footer = void 0;
const React = __importStar(require("react"));
const components_1 = require("@react-email/components");
//© 2023 Your Company Name. All rights reserved.
const Footer = ({ footerText }) => (React.createElement(components_1.Text, { style: footer },
    "This is an automated message, please do not reply to this email.",
    React.createElement("br", null),
    React.createElement("br", null),
    footerText));
exports.Footer = Footer;
const footer = {
    color: '#999',
    fontSize: '12px',
    lineHeight: '24px',
    textAlign: 'center',
    marginTop: '40px',
};
