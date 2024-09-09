import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../firebaseConfig';
import InputField from '../Registration/InputField';
import ErrorMessage from '../Registration/ErrorMessage';
import './LoginForm.css';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if any form fields are filled
  useEffect(() => {
    const isAnyFieldFilled = Object.values(formData).some((value) => value !== '');
    setIsFilled(isAnyFieldFilled);
  }, [formData]);

  // Remove session storage refresh only once and prevent unnecessary reloads
  useEffect(() => {
    if (sessionStorage.getItem('loginPageRefreshed')) {
      sessionStorage.removeItem('loginPageRefreshed');
    }
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const adminRef = ref(db, `admins/${user.uid}`);
      const userSnapshot = await get(userRef);
      const adminSnapshot = await get(adminRef);

      // Admins and regular users are redirected to the home page
      if (adminSnapshot.exists()) {
        navigate('/home');
      } else if (userSnapshot.exists()) {
        navigate('/home');
      } else {
        throw new Error('User data not found');
      }
    } catch (error: any) {
      setError('Incorrect username or password!');
    }
  };

  // Password reset handler
  const handlePasswordReset = () => {
    navigate('/reset-password');
  };

  return (
    <div id="login-page" className="login-page">
      <div
        className="header"
        onClick={() => {
          navigate('/home/news');
        }}
        style={{ cursor: 'pointer' }}
      >
        MyWork
      </div>
      <div id="login-form" className="login-form bg-dark text-white p-4 rounded">
        <h2>Welcome back!</h2>
        <p>Sign in to your account</p>
        {error && <ErrorMessage className="login-error" message={error} />}
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
        <p>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
        <p>
          <a href="#" className="text-primary" onClick={handlePasswordReset}>
            Forgot password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
