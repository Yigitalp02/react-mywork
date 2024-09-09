// src/components/Login/ResetPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import ErrorMessage from '../Registration/ErrorMessage';
import './ResetPasswordForm.css';
import { useNavigate, Link } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [isFilled, setIsFilled] = useState<boolean>(false);

  useEffect(() => {
    setIsFilled(email !== '');
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (error: any) {
      setError('Error sending password reset email.');
    }
  };

  return (
    <div id="reset-password-page" className="reset-password-page">
      <div
        className="header"
        onClick={() => {
          navigate('/home/news');
        }}
        style={{ cursor: 'pointer' }}
      >
        MyWork
      </div>
      <div className="reset-password-form bg-dark text-white p-4 rounded">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage className="reset-password-error" message={error} />}
          {message && (
            <p className="text-success success-message">
              {message}
              <br />
              <Link to="/login" className="login-link">Go back to Login page.</Link>
            </p>
          )}
          <div className="input-field mb-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-control"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary send-reset-button ${isFilled ? 'filled' : 'not-filled'}`}
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
