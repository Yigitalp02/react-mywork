import React, { useState } from 'react';
import { getDatabase, ref, set, push } from 'firebase/database';
import emailjs from 'emailjs-com';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save contact info in Firebase Realtime Database
    const db = getDatabase();
    const contactRequestRef = push(ref(db, 'Contact-Request')); // Create a new entry

    set(contactRequestRef, {
      name,
      email,
      phoneNumber,
    }).then(() => {
      // Send an email using EmailJS after saving the data
      sendEmail(name, email, phoneNumber);
    }).catch((error) => {
      console.error('Error saving contact request:', error);
    });
  };

  const sendEmail = (name: string, email: string, phoneNumber: string) => {
    const templateParams = {
      name: name,
      email: email,
      phone: phoneNumber,
    };

    emailjs.send('service_h2uk57t', 'template_l39cbsp', templateParams, '9h7w37IYT_ZFZeu8r')
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
        alert('Your contact request has been sent successfully!');
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <button type="submit" className="btn submit-button">Send</button>
    </form>
  );
};

export default ContactForm;
