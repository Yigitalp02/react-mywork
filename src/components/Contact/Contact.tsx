import React, { useEffect } from 'react';
import Header from './Header';
import './contact.css';
import 'leaflet/dist/leaflet.css';
import ContactForm from './ContactForm';
import { loadBootstrap } from '../../loadBootstrap';
import ContactInfo from './ContactInfo';
import Map from './Map';

const Contact: React.FC = () => {
  useEffect(() => {
    loadBootstrap();
  }, []);

  return (
    <div id="contact-page">
      <Header toggleSidebar={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <main className="container mt-5">
        <div className="middle-content p-4">
          <div className="row form-map-container">
            <div className="col-md-6 form-container">
              <h2 className="contact-header">Get in <span className="highlight">Touch</span></h2>
              <p className="contact-description">
                To contact me through email and ask questions, please fill out the form. I will return back to you through the contact info you submit.
              </p>
              <ContactForm />
              <ContactInfo />
            </div>
            <div className="col-md-6 map-container">
              <Map />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
