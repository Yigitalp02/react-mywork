import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProfileHeader from '../Contact/Header'; // Make sure the import path is correct
import Sidebar from './Sidebar';
import ProfileInfo from './ProfileInfo';
import ProfileTasks from './Reminders';
import { loadBootstrap } from '../../loadBootstrap';
import './profile.css';

const Profile: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    loadBootstrap();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div id="profile-page">
      <ProfileHeader toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to ProfileHeader */}
      <div className="profile-container">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass both isSidebarOpen and toggleSidebar to Sidebar */}
        <div className={`profile-main ${isSidebarOpen ? '' : 'collapsed'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="info" />} />
            <Route path="info" element={<ProfileInfo />} />
            <Route path="reminders" element={<ProfileTasks />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
