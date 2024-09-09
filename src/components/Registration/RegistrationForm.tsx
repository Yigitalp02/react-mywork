import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from '../firebaseConfig';
import { UserContext } from '../UserContext';
import './RegistrationForm.css';
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string>('');
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const isAnyFieldFilled = Object.values(formData).some(value => value !== '');
    setIsFilled(isAnyFieldFilled);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const db = getDatabase();
      await set(ref(db, 'users/' + user.uid), {
        name: formData.name,
        email: user.email ?? '',
        isAdmin: false,
      });

      userContext?.setUser({ uid: user.uid, email: user.email ?? '', name: formData.name, isAdmin: false });
      navigate('/login');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="registration-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="header" onClick={() => navigate('/home/news')} style={{ cursor: 'pointer' }}>MyWork</div> {/* Clickable header */}
      <div id="registration-form" className="registration-form bg-dark text-white p-4 rounded">
        <h2>Create a MyWork Account</h2>
        {error && <ErrorMessage className="registration-error" message={error} />}
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Carpenter"
            iconName="user"
          />
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jhcpart@emailserver.com"
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
          <InputField
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            iconName="password"
          />
          <button type="submit" className={`registration-button ${isFilled ? 'filled' : 'not-filled'}`}>
            Sign up
          </button>
        </form>
      </div>
      <div className="footer mt-3 text-white text-center">
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default RegistrationForm;
