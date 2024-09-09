import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProfileHeader from '../Contact/Header';
import SidebarHome from '../Profile/Sidebar';
import LatestNews from './LatestNews';
import Status from './Status';
import Persons from './Persons';
import HomeTasks from './HomeTasks';
import AdminTasks from './AdminTasks';
import MessageBoard from './Message/MessageBoard';
import MessageDetail from './Message/MessageDetail';
import CalendarPage from './Calendar/CalendarPage';
import { loadBootstrap } from '../../loadBootstrap';
import { UserContext } from '../UserContext';
import './home.css';
import Modal from 'react-bootstrap/Modal'; // Assuming you're using Bootstrap

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false); // State for showing the modal

  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();

  useEffect(() => {
    loadBootstrap();
  }, []);

  useEffect(() => {
    const authCheckTimeout = setTimeout(() => {
      setIsAuthChecked(true);
      if (!user) {
        setShowSignInModal(true); // Show the modal if the user is not authenticated
      }
    }, 1000);

    return () => clearTimeout(authCheckTimeout);
  }, [userContext, user]);

  const handleTasksClick = () => {
    if (user?.isAdmin) {
      navigate('/home/admin-tasks');
    } else {
      navigate('/home/tasks');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseModal = () => {
    setShowSignInModal(false); // Close the modal
  };

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div id="home-page">
      <ProfileHeader toggleSidebar={toggleSidebar} />
      <div className="home-container">
        <SidebarHome onTasksClick={handleTasksClick} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`home-main ${isSidebarOpen ? '' : 'collapsed'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="news" />} />
            <Route path="news" element={
              <>
                <LatestNews />
                <div className="home-bottom">
                  <Status />
                  <Persons />
                </div>
              </>
            } />
            <Route path="tasks" element={user ? <HomeTasks /> : <Navigate to="/login" replace />} />
            <Route path="admin-tasks" element={user?.isAdmin ? <AdminTasks /> : <Navigate to="/login" replace />} />
            <Route path="message-board" element={user ? <MessageBoard /> : <Navigate to="/login" replace />} />
            <Route path="message-board/:id" element={user ? <MessageDetail /> : <Navigate to="/login" replace />} />
            <Route path="calendar" element={user ? <CalendarPage /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<div>Not Found</div>} /> {/* Catch-all route for debugging */}
          </Routes>
        </div>
      </div>

      {/* Modal for Sign In */}
      <Modal show={showSignInModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Sign In to access all content!</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (!sessionStorage.getItem('loginPageRefreshed')) {
                sessionStorage.setItem('loginPageRefreshed', 'true');
               navigate('/login');
               window.location.reload(); // Refresh the page after navigating to /login
              } else {
                sessionStorage.removeItem('loginPageRefreshed'); // Remove the item after the first refresh
                navigate('/login');
              }
            }}>
            Sign In
          </button>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
