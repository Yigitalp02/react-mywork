// AddProfile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref as databaseRef, push, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddProfile.css';

const AddProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const database = getDatabase();
  const storage = getStorage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleAddProfile = async () => {
    if (name && profilePhoto) {
      setUploading(true);
      try {
        // Upload profile picture to Firebase Storage
        const photoRef = storageRef(storage, `profilePhotos/${name}_${profilePhoto.name}`);
        await uploadBytes(photoRef, profilePhoto);
        const profilePhotoUrl = await getDownloadURL(photoRef);

        // Create a new profile reference in Firebase Realtime Database
        const newProfileRef = push(databaseRef(database, 'participants'));
        await set(newProfileRef, {
          name,
          profilePhotoUrl,
          status: 'in',
        });

        // Navigate to profile selection page
        navigate('/nonutnovember/profile-selection');
      } catch (error) {
        console.error("Error adding profile:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div id="add-profile">
      <h2>Add New Profile</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
      <input type="file" accept="image/*" onChange={handleFileChange} className="input-field" />
      <button onClick={handleAddProfile} disabled={uploading} className="add-profile-btn">
        {uploading ? 'Uploading...' : 'Add Profile'}
      </button>
    </div>
  );
};

export default AddProfile;
