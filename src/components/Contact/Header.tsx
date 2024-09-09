import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { signOut, getAuth } from 'firebase/auth';
import { UserContext } from '../UserContext';
import './header.css';
import exit_logo from '../icons/exit_logo.png';
import menuIcon from '../icons/menu.png';
import SearchBar from '../Home/SearchBar';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('UserContext is not available');
  }

  const { user, setUser } = userContext;
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfilePicture(data.profilePicture || null);
        }
      });
    }
  }, [user]);

  const handleExitClick = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      if (setUser) {
        setUser(null); // Clear the user context
      }
      // Set a session storage item to track the refresh
      if (!sessionStorage.getItem('loginPageRefreshed')) {
        sessionStorage.setItem('loginPageRefreshed', 'true');
        navigate('/login');
        window.location.reload(); // Refresh the page after navigating to /login
      } else {
        sessionStorage.removeItem('loginPageRefreshed'); // Remove the item after the first refresh
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const aboutLink = user?.isAdmin ? '/admin-about' : '/about';

  return (
    <header id="header" className="header p-3">
      <div className="general ">
        <div className="d-flex align-items-center">
          <button className="menu-button" id="menuButton" onClick={toggleSidebar}>
            <img src={menuIcon} alt="Menu" className="menu-icon" />
          </button>
          <button className="header-title" onClick={() => navigate('/home')}>MyWork
          </button>
          {user && (
            <button onClick={handleExitClick} className="exit-button-mobile">
              <img src={exit_logo} alt="Exit" className="exit-icon-mobile" />
            </button>
          )}
        </div>
        <div className="navbar2">
          {user && <SearchBar />}
          {!user && (
          <div className="guest-links">
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            <button 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
              onClick={() => {
                // Check if the page has already been refreshed
                if (!sessionStorage.getItem('loginPageRefreshed')) {
                  sessionStorage.setItem('loginPageRefreshed', 'true');
                  navigate('/login');
                  window.location.reload(); // Refresh the page after navigating to /login
                } else {
                  sessionStorage.removeItem('loginPageRefreshed'); // Remove the item after the first refresh
                  navigate('/login');
                }
              }}
            >
              Sign In
            </button>
          </div>
          )}
          {user && (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
              <Link to={aboutLink} className={`nav-link ${isActive('/about') || isActive('/admin-about') ? 'active' : ''}`}>About Us</Link>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </>
          )}
        </div>
        {user && (
          <div className="user-info">
            {profilePicture && <img src={profilePicture} alt="Profile" className="user-profile-picture" />}
            <span className="user-name">Logged In: {user?.name}</span>
            <button onClick={handleExitClick} className="exit-button d-flex align-items-center">
              <img src={exit_logo} alt="Exit" className="exit-icon" />
              <span className="ml-1">Exit</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
