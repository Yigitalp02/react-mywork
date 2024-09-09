import React, { useContext, useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { UserContext } from '../UserContext';
import './persons.css';

interface User {
  name: string;
  email: string;
  uid: string;
  profilePicture?: string; // Profil resmi URL'si için opsiyonel özellik
}

const Persons: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Kullanıcılar için durum tanımlanıyor
  const userContext = useContext(UserContext); // Kullanıcı bilgilerini context'ten alır

  // Bileşen yüklendiğinde kullanıcı verilerini almak için useEffect kullanılır
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users'); // Veritabanında 'users' referansı oluşturulur

    // Veritabanı değişikliklerini dinler ve kullanıcıları günceller
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key], // Kullanıcı verilerini objeye yayar
        }));
        setUsers(usersList); // Kullanıcı durumunu günceller
      }
    });
  }, []);

  return (
    <div id="persons-section" className="persons-section">
      <h2>Registered Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.uid} className="person-item">
            {user.profilePicture && ( // Eğer kullanıcı profil resmi eklemişse
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                className="profile-picture"
              />
            )}
            <span className="person-name">{user.name}</span> {/* Kullanıcı adını gösterir */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;
