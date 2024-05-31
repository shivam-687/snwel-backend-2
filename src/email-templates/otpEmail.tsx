import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function OtpEmail(props: {otp: string}) {
  const { otp } = props;

  return (
    <Html lang="en">
      <h1>Your OTP is {otp}</h1>
    </Html>
  );
}
