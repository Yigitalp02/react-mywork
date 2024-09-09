import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import Header from '../Contact/Header';
import './aboutus.css';
import { loadBootstrap } from '../../loadBootstrap';

const AboutUs: React.FC = () => {
  const [text, setText] = useState<string>(''); // State for About Us content
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // State for loading status

  useEffect(() => {
    loadBootstrap(); // Load Bootstrap for styling
  }, []);

  useEffect(() => {
    const db = getDatabase(); // Get Firebase Realtime Database instance
    const aboutUsRef = ref(db, 'aboutUs/text'); // Reference to the About Us text in the database

    // Fetch the About Us content from Firebase
    onValue(aboutUsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Replace newlines with <br /> tags
        const formattedText = data.replace(/\n/g, '<br />');
        setText(formattedText); // Set the formatted About Us text
      } else {
        setText('Default About Us content.'); // Set fallback content if none is found in the database
      }
      setIsLoaded(true); // Mark content as loaded
    });
  }, []);

  return (
    <div id="about-page">
      <Header toggleSidebar={() => {}} /> {/* Pass an empty function to toggleSidebar */}
      <main className="main-section">
        <div className="content-wrapper">
          <h1 className="about-header">About this Website,</h1>
          {isLoaded ? (
            <p
              className="about-paragraph"
              dangerouslySetInnerHTML={{ __html: text }} // Use dangerouslySetInnerHTML to render the formatted text
            />
          ) : (
            <div>Loading...</div> /* Loading message while fetching data */
          )}
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
