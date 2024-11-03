import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref as databaseRef, onValue, update } from 'firebase/database';
import './ChallengePage.css';
import backIcon from '../icons/back.png';

interface Profile {
  id: string;
  name: string;
  profilePhotoUrl: string;
}

interface Participant extends Profile {
  status: 'in' | 'out';
  attirdimCount?: number;
}

const getTimeLeft = () => {
  const endOfNovember = new Date(new Date().getFullYear(), 10, 30, 23, 59, 59);
  const now = new Date();
  const difference = endOfNovember.getTime() - now.getTime();

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const ChallengePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state as { profile: Profile };
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const database = getDatabase();

  useEffect(() => {
    // Update current date and countdown every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const participantsRef = databaseRef(database, 'participants');
    onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedParticipants = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setParticipants(loadedParticipants);
    });
  }, [database]);

  const handleStatusChange = async (newStatus: 'in' | 'out') => {
    const participantRef = databaseRef(database, `participants/${profile.id}`);
    await update(participantRef, { status: newStatus });
  };

  const handleIncrementAttirdim = async () => {
    const participantRef = databaseRef(database, `participants/${profile.id}`);
    const currentParticipant = participants.find((p) => p.id === profile.id);

    if (currentParticipant && currentParticipant.status === 'out') {
      const newCount = (currentParticipant.attirdimCount || 0) + 1;
      await update(participantRef, { attirdimCount: newCount });
    }
  };

  return (
    <div id="challenge-page">
      {/* Go Back Button */}
      <button className="go-back-button" onClick={() => navigate('/tracker/profile-selection')}>
        <span className="desktop-label">Go Back</span>
        <button className="mobile-icon">
          <img src={backIcon} alt="back" className="mobile-icon" />
        </button>
      </button>

      <h2>Welcome, {profile.name}</h2>
      <img src={profile.profilePhotoUrl} alt={`${profile.name}'s Profile`} className="profile-photo" />

      {/* Wrapper for Current Date and Time */}
      <div className="content-wrapper">
        <div className="current-date-time">
          <p>Date: {currentDate.toLocaleDateString()}</p>
          <p>Time: {currentDate.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Wrapper for Countdown Timer */}
      <div className="content-wrapper">
        <div className="countdown-timer">
          <p>
            {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds left until the end of November!
          </p>
        </div>
      </div>

      {/* Wrapper for Status Selection */}
      <div className="content-wrapper">
        <div className="status-selection">
          <button onClick={() => handleStatusChange('in')}>Still In</button>
          <button onClick={() => handleStatusChange('out')}>Lost</button>
          <button onClick={handleIncrementAttirdim}>Attırdım</button>
        </div>
      </div>

      {/* Wrapper for Participants */}
      <div className="content-wrapper">
        <div className="participants">
          <h3>In The Challenge</h3>
          <div className="participants-list">
            {participants
              .filter((p) => p.status === 'in')
              .map((p) => (
                <div key={p.id} className="participant">
                  <img src={p.profilePhotoUrl} alt={p.name} className="participant-photo" />
                  <p>{p.name}</p>
                  <p className="attirdim-count">
                    {p.attirdimCount ? `Attırdım: ${p.attirdimCount}` : 'Attırdım: 0'}
                  </p>
                </div>
              ))}
          </div>

          <h3>Lost The Challenge</h3>
          <div className="participants-list">
            {participants
              .filter((p) => p.status === 'out')
              .map((p) => (
                <div key={p.id} className="participant">
                  <img src={p.profilePhotoUrl} alt={p.name} className="participant-photo" />
                  <p>{p.name}</p>
                  <p className="attirdim-count">
                    {p.attirdimCount ? `Attırdım: ${p.attirdimCount}` : 'Attırdım: 0'}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
