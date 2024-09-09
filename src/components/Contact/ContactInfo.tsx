import React from 'react';
import './contact.css';
import PhoneLogo from '../icons/phone_logo.png';
import FaxLogo from '../icons/fax_logo.png';
import EmailLogo from '../icons/email_logo.png';

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-info mt-4 d-flex flex-column flex-md-row justify-content-between">
      <div className="contact-item d-flex align-items-center mb-2 mb-md-0">
        <img src={PhoneLogo} alt="Phone" className="contact-icon" />
        <div>
          <p className="font-weight-bold mb-0">PHONE</p>
          <span className="text-danger">03 5432 1234</span>
        </div>
      </div>
      <div className="contact-item d-flex align-items-center mb-2 mb-md-0">
        <img src={FaxLogo} alt="Fax" className="contact-icon" />
        <div>
          <p className="font-weight-bold mb-0">FAX</p>
          <span className="text-danger">03 5432 1234</span>
        </div>
      </div>
      <div className="contact-item d-flex align-items-center">
        <img src={EmailLogo} alt="Email" className="contact-icon" />
        <div>
          <p className="font-weight-bold mb-0">EMAIL</p>
          <a href="mailto:info@marcc.com.au" className="text-danger">bilginyigitalp03@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
