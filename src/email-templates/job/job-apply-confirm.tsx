import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  export interface JobApplicationEmailProps {
    applicantName: string;
    jobTitle: string;
    companyName: string;
    contactEmail: string;
    careersPageUrl: string;
    senderName: string;
    senderJobTitle: string;
    companyContactInfo: string;
    companyWebsite: string;
    companyLogo: string;
  }
  
  const baseUrl = 'https://example.com';
  
  export const JobApplicationEmail: React.FC<JobApplicationEmailProps> = ({
    applicantName,
    jobTitle,
    companyName,
    contactEmail,
    careersPageUrl,
    senderName,
    senderJobTitle,
    companyContactInfo,
    companyWebsite,
    companyLogo
  }) => {
    return (
      <Html>
        <Head />
        <Preview>Thank you for your application to {companyName}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src={companyLogo}
              width="170"
              height="50"
              alt={`${companyName} Logo`}
              style={logo}
            />
            <Heading style={h1}>
              Application Received
            </Heading>
            <Text style={text}>
              Dear {applicantName},
            </Text>
            <Text style={text}>
              Thank you for submitting your application for the <strong>{jobTitle}</strong> position at {companyName}. We appreciate your interest in joining our team!
            </Text>
            <Text style={text}>
              Our hiring team is currently reviewing your application and qualifications. If your profile matches our requirements, we will be in touch to schedule the next steps in the hiring process, such as an interview.
            </Text>
            <Text style={text}>
              Please note, due to the high volume of applications, it may take some time to process all submissions. Rest assured, we will keep you updated on the status of your application.
            </Text>
            <Text style={text}>
              If you have any questions in the meantime, feel free to reach out to us at{' '}
              <Link href={`mailto:${contactEmail}`} style={link}>
                {contactEmail}
              </Link>{' '}
              or visit our{' '}
              <Link href={careersPageUrl} style={link}>
                careers page
              </Link>{' '}
              for more information.
            </Text>
            <Text style={text}>
              Thank you once again for considering {companyName} as your next career move. We look forward to reviewing your application.
            </Text>
            <Text style={text}>
              Best regards,
            </Text>
            <Text style={signature}>
              {senderName}
              <br />
              {senderJobTitle}
              <br />
              {companyName}
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              {companyContactInfo}
              <br />
              <Link href={companyWebsite} style={link}>
                {companyWebsite}
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default JobApplicationEmail;
  
  const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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
    textAlign: 'center' as const,
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
    textAlign: 'center' as const,
    margin: '0',
  };