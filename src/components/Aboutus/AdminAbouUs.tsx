// src/components/AdminAboutUs.tsx
import React, { useState, useEffect, useContext } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { UserContext } from '../UserContext';
import Header from '../Contact/Header';
import './aboutus.css';
import { loadBootstrap } from '../../loadBootstrap.tsx';

const AdminAboutUs: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { user } = useContext(UserContext) || {};

  useEffect(() => {
    loadBootstrap();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const aboutUsRef = ref(db, 'aboutUs/text');
    onValue(aboutUsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setText(data);
        setIsLoaded(true);
      }
    });
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    const db = getDatabase();
    set(ref(db, 'aboutUs/text'), text);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div id="about-page">
      <Header toggleSidebar={() => {}} /> {/* Pass an empty function to toggleSidebar */}
      <main className="main-section">
        <div className="content-wrapper">
          <h1 className="about-header">Edit About Us</h1>
          <textarea
            className="about-textarea"
            value={text}
            onChange={handleTextChange}
          />
          <button onClick={handleSave} className="save-button">Save</button>
        </div>
      </main>
    </div>
  );
};

export default AdminAboutUs;
