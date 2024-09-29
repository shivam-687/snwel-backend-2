import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  export interface CourseInquiryEmailProps {
    userName: string;
    courseTitle: string;
    courseDuration: string;
    difficulty: string;
    languages: string;
    price: string;
    currency: string;
    discount?: string;
    certificateAvailable: 'Yes' | 'No';
    trainingModes: string;
    supportEmail: string;
    phoneNumber: string;
    companyName: string;
    websiteUrl: string;
    logoUrl: string;
  }
  
  
  export const CourseInquiryEmail: React.FC<CourseInquiryEmailProps> = ({
    userName,
    courseTitle,
    courseDuration,
    difficulty,
    languages,
    price,
    currency,
    discount,
    certificateAvailable,
    trainingModes,
    supportEmail,
    phoneNumber,
    companyName,
    websiteUrl,
    logoUrl
  }) => {
    return (
      <Html>
        <Head />
        <Preview>Inquiry Received for {courseTitle} - Thank You!</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src={logoUrl}
              width="150"
              height="50"
              alt={`${companyName} Logo`}
              style={logo}
            />
            <Heading style={h1}>
              Inquiry Received for {courseTitle}
            </Heading>
            <Text style={text}>
              Dear {userName},
            </Text>
            <Text style={text}>
              Thank you for your interest in our course "{courseTitle}". We're excited to provide you with more information!
            </Text>
            <Section style={courseDetails}>
              <Heading as="h2" style={h2}>
                Course Details:
              </Heading>
              <Text style={detailItem}>
                <strong style={detailLabel}>Duration:</strong> {courseDuration}
              </Text>
              <Text style={detailItem}>
                <strong style={detailLabel}>Difficulty:</strong> {difficulty||'N/A'}
              </Text>
              <Text style={detailItem}>
                <strong style={detailLabel}>Language(s):</strong> {languages||'N/A'}
              </Text>
              <Text style={detailItem}>
                <strong style={detailLabel}>Price:</strong> {price} {currency}
              </Text>
              {discount && (
                <Text style={detailItem}>
                  <strong style={detailLabel}>Discounts:</strong> {discount||'N/A'}
                </Text>
              )}
              <Text style={detailItem}>
                <strong style={detailLabel}>Certificate:</strong> {certificateAvailable ? 'Yes' : 'No'}
              </Text>
              <Text style={detailItem}>
                <strong style={detailLabel}>Training Mode:</strong> {trainingModes||'N/A'}
              </Text>
            </Section>
            <Text style={text}>
              If you have any questions, please reply to this email or contact our support team:
            </Text>
            <Section style={buttonContainer}>
              <Link
                href={`mailto:${supportEmail}`}
                style={button}
              >
                Contact Support
              </Link>
            </Section>
            <Text style={text}>
              We'll get back to you shortly with more information to address all your queries.
            </Text>
            <Text style={text}>
              Best regards,<br />
              {companyName} Team
            </Text>
          </Container>
          <Container style={footer}>
            <Link href={websiteUrl} style={footerLink}>
              {websiteUrl}
            </Link>
            <Text style={footerText}>
              {supportEmail} | {phoneNumber}
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default CourseInquiryEmail;
  
  const main = {
    backgroundColor: '#f0f4f8',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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
    textAlign: 'center' as const,
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
    textAlign: 'center' as const,
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
    textAlign: 'center' as const,
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
    textAlign: 'center' as const,
  };