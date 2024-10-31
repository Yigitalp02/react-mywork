// ProfileSelection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import './ProfileSelection.css';

interface Profile {
  id: string;
  name: string;
  profilePhotoUrl: string;
}

const ProfileSelection: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const navigate = useNavigate();
  const database = getDatabase();

  useEffect(() => {
    const profilesRef = databaseRef(database, 'participants');
    onValue(profilesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProfiles = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProfiles(loadedProfiles);
    });
  }, [database]);

  const handleProfileSelect = (profile: Profile) => {
    navigate('/tracker/challenge', { state: { profile } });
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
    </div>
  );
};

export default ProfileSelection;
