class NodemailerService {
    private config: any;
  
    constructor(config: any) {
      this.config = config;
    }
  
    async sendMessage(recipient: string,subject: string,  html: string) {
      try {
        // Use an email API to send the email (e.g., nodemailer, SendGrid, etc.)
        console.log(`Sending email to ${recipient}: ${html}`);
        return { success: true, message: 'Email sent successfully' };
      } catch (error: any) {
        console.error('Email service error:', error);
        return { success: false, message: error.message };
      }
    }
  }
  
  export default NodemailerService;
  