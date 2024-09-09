import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { UserContext } from '../UserContext';
import './profileHeader.css';
import searchIcon from '../icons/search.png';
import exitLogo from '../icons/exit_logo.png';

const ProfileHeader: React.FC = () => {
  const location = useLocation(); // Şu anki URL yolunu almak için kullanılır
  const navigate = useNavigate(); // Navigasyon için kullanılır
  const { user } = useContext(UserContext) || {}; // Kullanıcı bilgilerini context'ten alır
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // Profil resmi durumu

  const isActive = (path: string) => location.pathname.startsWith(path); // Belirli bir yolun aktif olup olmadığını kontrol eder

  useEffect(() => {
    // Kullanıcı verilerini Firebase'den almak için kullanılır
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfilePicture(data.profilePicture || null); // Profil resmini duruma ayarlar
        }
      });
    }
  }, [user]);

  const handleExitClick = () => {
    navigate('/login'); // Çıkış butonuna tıklandığında giriş sayfasına yönlendirir
  };

  return (
    <header id="profile-header">
      <div className="search-bar-container">
        <div className="search-bar">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>
      <div className="navbar">
        <Link to="/profile/info" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
        <div className="user-info">
          {profilePicture && <img src={profilePicture} alt="Profile" className="user-profile-picture" />}
          <span className="user-name">Logged In: {user?.name}</span> {/* Kullanıcı adı gösterimi */}
        </div>
        <button onClick={handleExitClick} className="exit-button">
          <img src={exitLogo} alt="Exit" className="exit-icon" />
          <span className="ml-1">Exit</span>
        </button>
      </div>
    </header>
  );
};

export default ProfileHeader;
