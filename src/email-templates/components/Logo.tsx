import * as React from 'react';
import { Img } from '@react-email/components';

type LogoProps = {
    logoUrl: string
}

export const Logo = ({logoUrl}: LogoProps) => (
  <Img
    src={logoUrl}
    width="150"
    height="50"
    alt="Company Logo"
    style={logo}
  />
);

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};