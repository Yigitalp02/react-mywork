import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';
import menuIcon from '../icons/menu.png';
import newsIcon from '../icons/news.png';
import tasksIcon from '../icons/tasks.png';
import messageBoardIcon from '../icons/messageBoard.png';
import calendarIcon from '../icons/calendar.png'; // Import calendar icon
import infoIcon from '../icons/info.png';
import remindersIcon from '../icons/tasks.png';
import linkedinIcon from '../icons/linkedin.png';
import instagramIcon from '../icons/instagram.png';
import twitterIcon from '../icons/twitter.png';
import { UserContext } from '../UserContext';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onTasksClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar, onTasksClick }) => {
  const location = useLocation();
  const { user } = useContext(UserContext) || {};
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if screen is mobile

  // Automatically collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      toggleSidebar(); // Collapse the sidebar on mobile load
    }
  }, [isMobile]);

  const isActive = (path: string) => location.pathname === path;
  const isHomeSection = location.pathname.startsWith('/home');

  return (
    <div id="sidebar" className={`sidebar ${isSidebarOpen ? '' : 'collapsed'} ${isMobile ? 'mobile-sidebar' : ''}`}>
      <div className="sidebar-header">
        <button className="menu-button" onClick={toggleSidebar}>
          <img src={menuIcon} alt="Menu" className="sidebar-icon" />
        </button>
        {isSidebarOpen && (
          <Link to="/home" className="sidebar-title"> {/* Use Link here */}
          MyWork
          </Link>
        )}
      </div>
      <div className="sidebar-links">
        {isHomeSection ? (
          <>
            <Link to="/home/news" className={`sidebar-link ${isActive('/home/news') ? 'active' : ''}`}>
              <img src={newsIcon} alt="News" className="sidebar-icon" />
              {isSidebarOpen && <span>News</span>}
            </Link>
            {user && (
              <>
                <Link
                  to={user?.isAdmin ? '/home/admin-tasks' : '/home/tasks'}
                  className={`sidebar-link ${isActive('/home/tasks') || isActive('/home/admin-tasks') ? 'active' : ''}`}
                  onClick={onTasksClick}
                >
                  <img src={tasksIcon} alt="Tasks" className="sidebar-icon" />
                  {isSidebarOpen && <span>Tasks</span>}
                </Link>
                <Link to="/home/message-board" className={`sidebar-link ${isActive('/home/message-board') ? 'active' : ''}`}>
                  <img src={messageBoardIcon} alt="Message Board" className="sidebar-icon" />
                  {isSidebarOpen && <span>Message Board</span>}
                </Link>
                <Link to="/home/calendar" className={`sidebar-link ${isActive('/home/calendar') ? 'active' : ''}`}>
                  <img src={calendarIcon} alt="Calendar" className="sidebar-icon" />
                  {isSidebarOpen && <span>Calendar</span>}
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/profile/info" className={`sidebar-link ${isActive('/profile/info') ? 'active' : ''}`}>
              <img src={infoIcon} alt="Info" className="sidebar-icon" />
              {isSidebarOpen && <span>Info</span>}
            </Link>
            <Link to="/profile/reminders" className={`sidebar-link ${isActive('/profile/reminders') ? 'active' : ''}`}>
              <img src={remindersIcon} alt="Reminders" className="sidebar-icon" />
              {isSidebarOpen && <span>Reminders</span>}
            </Link>
          </>
        )}
      </div>

      {/* Add your name here */}
      {isSidebarOpen && (
        <div className="sidebar-name">
          <span>Yiğit Alp Bilgin</span>
        </div>
      )}

      <div className="sidebar-social-media">
        <a href="https://www.linkedin.com/in/yi%C4%9Fit-alp-bilgin-964444148/" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
        </a>
        <a href="https://www.instagram.com/yigitalp_bilgin/" target="_blank" rel="noopener noreferrer">
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <img src={twitterIcon} alt="Twitter" className="social-icon" />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
