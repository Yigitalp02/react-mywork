import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref as databaseRef, onValue, update } from 'firebase/database';
import './ProfileSelection.css';

interface Profile {
  id: string;
  name: string;
  profilePhotoUrl: string;
  password?: string;
}

const ProfileSelection: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const navigate = useNavigate();
  const database = getDatabase();

  useEffect(() => {
    const profilesRef = databaseRef(database, 'participants');
    onValue(profilesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProfiles = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setProfiles(loadedProfiles);
    });
  }, [database]);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setPasswordInput('');
    setIsSettingPassword(!profile.password); // If no password, switch to set mode
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (selectedProfile) {
      if (isSettingPassword) {
        // Set the password for the first time
        await update(databaseRef(database, `participants/${selectedProfile.id}`), { password: passwordInput });
        closePasswordModal();
        navigate('/tracker/challenge', { state: { profile: selectedProfile } });
      } else {
        // Verify existing password
        if (selectedProfile.password === passwordInput) {
          closePasswordModal();
          navigate('/tracker/challenge', { state: { profile: selectedProfile } });
        } else {
          alert('Incorrect password. Please try again.');
        }
      }
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
  };

  return (
    <div id="profile-selection">
      <h2>Select Your Profile</h2>
      <div className="profile-list">
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-item" onClick={() => handleProfileSelect(profile)}>
            <img src={profile.profilePhotoUrl} alt={profile.name} className="profile-photo" />
            <p className="profile-name">{profile.name}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/tracker/add-profile')} className="add-profile">Add Profile</button>

      {showPasswordModal && (
        <>
          <div className="modal-overlay" onClick={closePasswordModal}></div>
          <div className="password-modal">
            <button className="close-modal" onClick={closePasswordModal}>×</button>
            <h3>{isSettingPassword ? 'Set a Password' : 'Enter Password'}</h3>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={isSettingPassword ? 'Set your password' : 'Enter your password'}
              className="password-input"
            />
            <button onClick={handlePasswordSubmit} className="submit-password">
              {isSettingPassword ? 'Set Password' : 'Submit'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSelection;
