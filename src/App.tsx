// src/App.tsx

import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import { UserProvider } from './components/UserContext';
import RegistrationForm from './components/Registration/RegistrationForm';
import LoginForm from './components/Login/LoginForm';
import ResetPasswordForm from './components/Login/ResetPasswordForm';
import Home from './components/Home/Home';
import Contact from './components/Contact/Contact';
import AboutUs from './components/Aboutus/AboutUs';
import AdminAboutUs from './components/Aboutus/AdminAbouUs'; // Fixed typo here as well
import Profile from './components/Profile/Profile';
import background2 from './icons/background1.png';
import background1 from './icons/background2.png';

const App: React.FC = () => (
  <Router basename="/react-mywork"> {/* Add basename to account for GitHub Pages deployment */}
    <UserProvider>
      <AppContent />
    </UserProvider>
  </Router>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const authPages = ['/register', '/login', '/reset-password'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className={`app ${isAuthPage ? 'auth-page' : ''}`}>
      {isAuthPage && (
        <div className="left-images">
          <img src={background1} alt="Background 1" className="background1" />
          <img src={background2} alt="Background 2" className="background2" />
        </div>
      )}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home/news" />} /> {/* Redirect to home page */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin-about" element={<AdminAboutUs />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
