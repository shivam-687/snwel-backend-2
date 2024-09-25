import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OTPEmailTemplateProps {
  otpCode: string;
  logoUrl: string;
  footerText: string
}

export const OTPEmailTemplate: React.FC<OTPEmailTemplateProps> = ({
  otpCode = '123456',
  footerText="20265 Snwel Academy",
  logoUrl
}) => {
  return (
    <Html>
      <Head />
      <Preview>Your One-Time Password (OTP)</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={logoUrl}
            width="150"
            height="50"
            alt="Company Logo"
            style={logo}
          />
          <Heading style={h1}>Your One-Time Password</Heading>
          <Text style={text}>
            Use the following OTP to complete your action. This code will expire in 10 minutes.
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otpCode}</Text>
          </Section>
          <Text style={text}>
            If you didn't request this code, please ignore this email.
          </Text>
          <Text style={footer}>
            This is an automated message, please do not reply to this email.
            <br />
            <br />
            {footerText}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OTPEmailTemplate;

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
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
  textAlign: 'center' as const,
};

const footer = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '40px',
};