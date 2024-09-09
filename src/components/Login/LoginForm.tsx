import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../firebaseConfig';
import InputField from '../Registration/InputField';
import ErrorMessage from '../Registration/ErrorMessage';
import './LoginForm.css';

// Form verilerini tutacak arayüz
interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [isFilled, setIsFilled] = useState<boolean>(false); // Formun doldurulup doldurulmadığını kontrol eder
  const [error, setError] = useState<string>(''); // Hata mesajını tutar
  const navigate = useNavigate(); // Sayfa yönlendirmesi için kullanılır

  // Input alanlarındaki değişiklikleri takip eder
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form verilerindeki değişiklikleri izler ve formun doldurulup doldurulmadığını kontrol eder
  useEffect(() => {
    const isAnyFieldFilled = Object.values(formData).some(value => value !== '');
    setIsFilled(isAnyFieldFilled);
  }, [formData]);

  // Refresh the page only once after navigating to /login
  useEffect(() => {
    if (!sessionStorage.getItem('refreshed')) {
      sessionStorage.setItem('refreshed', 'true');
      window.location.reload();
    }
  }, []);

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Formun varsayılan gönderimini engeller
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Clear the refresh flag when logging in
      sessionStorage.removeItem('loginPageRefreshed');
      
      // Kullanıcının admin olup olmadığını kontrol eder
      const db = getDatabase();
      const adminRef = ref(db, `admins/${user.uid}`);
      const adminSnapshot = await get(adminRef);

      if (adminSnapshot.exists()) {
        navigate('/home');
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      setError('Incorrect username or password!'); // Hata durumunda mesaj gösterir
    }
  };

  // Şifre sıfırlama sayfasına yönlendirme fonksiyonu
  const handlePasswordReset = () => {
    navigate('/reset-password');
  };

  return (
    <div id="login-page" className="login-page">
      <div className="header" 
           onClick={() => {
             sessionStorage.removeItem('loginPageRefreshed'); // Remove the refresh flag
             navigate('/home/news'); // Navigate to the home page
           }} 
           style={{ cursor: 'pointer' }}>
           MyWork
      </div> {/* Clickable header */}
      <div id="login-form" className="login-form bg-dark text-white p-4 rounded">
        <h2>Welcome back!</h2>
        <p>Sign in to your account</p>
        {error && <ErrorMessage className="login-error" message={error} />} {/* Hata mesajı */}
        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="mymail@mailserver.com"
            iconName="email"
          />
          <InputField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            iconName="password"
          />
          <button
            type="submit"
            className={`login-button ${isFilled ? 'filled' : 'not-filled'}`}
          >
            Login
          </button>
        </form>
      </div>
      <div className="footer mt-3 text-white">
        <p>Don't have an account? <a href="/register">Sign up</a></p> {/* Kayıt ol linki */}
        <p><a href="" className="text-primary" onClick={handlePasswordReset}>Forgot password?</a></p> {/* Şifremi unuttum linki */}
      </div>
    </div>
  );
};

export default LoginForm;
