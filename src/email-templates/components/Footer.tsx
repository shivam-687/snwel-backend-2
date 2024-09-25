import * as React from 'react';
import { Text } from '@react-email/components';
//© 2023 Your Company Name. All rights reserved.
export const Footer = ({footerText}: {footerText: string}) => (
  <Text style={footer}>
    This is an automated message, please do not reply to this email.
    <br />
    <br />
    {footerText}
  </Text>
);

const footer = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '40px',
};