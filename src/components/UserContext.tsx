// src/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from './firebaseConfig';

// Kullanıcı arayüzü
interface User {
  uid: string; // Kullanıcı ID'si
  email: string; // Kullanıcı e-posta adresi
  name: string; // Kullanıcı adı
  isAdmin: boolean; // Kullanıcının yönetici olup olmadığını belirten bayrak
}

// Kullanıcı bağlamı özellikleri arayüzü
interface UserContextProps {
  user: User | null; // Kullanıcı bilgileri
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Kullanıcı durumunu güncellemek için fonksiyon
}

// Kullanıcı sağlayıcı bileşeni özellikleri arayüzü
interface UserProviderProps {
  children: ReactNode; // Çocuk bileşenler
}

// Kullanıcı bağlamı oluşturma
export const UserContext = createContext<UserContextProps | undefined>(undefined);

// Kullanıcı sağlayıcı bileşeni
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Kullanıcı durumu

  // Firebase kimlik doğrulama durumunu izlemek için etki
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Kullanıcı giriş yaptıysa, kullanıcı bilgilerini veritabanından al
        const db = getDatabase();
        const userRef = ref(db, 'users/' + authUser.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUser({ uid: authUser.uid, email: authUser.email || '', ...data }); // Kullanıcı bilgilerini güncelle
        });
      } else {
        setUser(null); // Kullanıcı çıkış yaptıysa kullanıcı durumunu null yap
      }
    });

    return () => unsubscribe(); // Temizlik işlemi
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Çocuk bileşenleri bağlam sağlayıcı içine yerleştir */}
    </UserContext.Provider>
  );
};
