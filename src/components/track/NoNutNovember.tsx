// NoNutNovember.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileSelection from './ProfileSelection';
import ChallengePage from './ChallengePage';
import AddProfile from './AddProfile';
import './NoNutNovember.css';

const NoNutNovember: React.FC = () => {
  return (
    <div id="no-nut-november">
      <h1>No Nut November Challenge</h1>
      <Routes>
        <Route path="/" element={<Navigate to="profile-selection" />} /> {/* Redirect to profile selection */}
        <Route path="profile-selection" element={<ProfileSelection />} />
        <Route path="challenge" element={<ChallengePage />} />
        <Route path="add-profile" element={<AddProfile />} />
      </Routes>
    </div>
  );
};

export default NoNutNovember;
