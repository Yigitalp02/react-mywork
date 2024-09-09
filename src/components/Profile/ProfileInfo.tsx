import React, { useState, useContext, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as databaseRef, update, onValue } from 'firebase/database';
import { UserContext } from '../UserContext';
import { getAuth, updatePassword } from 'firebase/auth';
import './profileInfo.css';

const ProfileInfo: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(""); // Profile picture state
  const [uploading, setUploading] = useState<boolean>(false); // Uploading state
  const [name, setName] = useState<string>(''); // Name state
  const [email, setEmail] = useState<string>(''); // Email state
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Phone number state
  const [password, setPassword] = useState<string>(''); // Password state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const { user } = useContext(UserContext) || {}; // Get user info from context

  // Fetch user data from Firebase when the component mounts
  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = databaseRef(db, 'users/' + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfilePicture(data.profilePicture || '');
          setName(data.name || '');
          setEmail(data.email || '');
          setPhoneNumber(data['phone-number'] || '');
        }
      });
    }
  }, [user]);

  // Handle profile picture change
  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const storage = getStorage();
      const fileRef = storageRef(storage, `profilePictures/${user.uid}`);
      setUploading(true); // Set uploading state
      try {
        await uploadBytes(fileRef, file); // Upload file to storage
        const fileURL = await getDownloadURL(fileRef); // Get the download URL
        const db = getDatabase();
        await update(databaseRef(db, 'users/' + user.uid), { profilePicture: fileURL }); // Update profile picture in database
        setProfilePicture(fileURL); // Update local state with new profile picture
      } catch (error) {
        console.error("Error uploading file:", error); // Log error
      }
      setUploading(false); // Reset uploading state
    }
  };

  // Handle form submission to update user data in Firebase
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      const db = getDatabase();
      const updates: any = {};
      if (name) updates['/users/' + user.uid + '/name'] = name;
      if (email) updates['/users/' + user.uid + '/email'] = email;
      if (phoneNumber) updates['/users/' + user.uid + '/phone-number'] = phoneNumber;

      try {
        await update(databaseRef(db), updates); // Update other user details in Realtime Database

        // Update password using Firebase Authentication if provided
        if (password) {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser) {
            await updatePassword(currentUser, password);
          }
        }

        setSuccessMessage('Your infos are updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error updating info:', error);
      }
    }
  };

  return (
    <div id="info-section" className="info-section">
      <div className="info-container">
        <div className="picture-container">
          <img src={profilePicture as string} alt="Profile" className="profile-picture" />
          <label htmlFor="change-picture" className="change-picture-button">
            {uploading ? 'Uploading...' : 'Change Picture'}
          </label>
          <input
            type="file"
            id="change-picture"
            accept="image/*"
            onChange={handlePictureChange}
            style={{ display: 'none' }}
          />
        </div>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form className="info-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="form-group">
            <label>Email Id</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Id"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
