import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';


interface Props {
  onVerify: (token: string | null) => void;
}

const Recaptcha: React.FC<Props> = ({ onVerify }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''}
      onChange={onVerify}
    />
  );
};

export default Recaptcha;