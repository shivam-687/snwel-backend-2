"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodemailerService {
    constructor(config) {
        this.config = config;
    }
    async sendMessage(recipient, subject, html) {
        try {
            console.log(`Sending email to ${recipient}: ${html}`);
            return { success: true, message: 'Email sent successfully' };
        }
        catch (error) {
            console.error('Email service error:', error);
            return { success: false, message: error.message };
        }
    }
}
exports.default = NodemailerService;
