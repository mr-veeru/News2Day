// Import necessary libraries and components
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Define the Login component
const Login = () => {
  // Initialize state variables
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to send OTP
  const sendOTP = async () => {
    try {
      const formattedPhoneNumber = `+${phone.replace(/\D/g, '')}`;
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptcha);
      setUser(confirmation);
      setSuccessMessage('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Failed to send OTP. Please try again.');
    }
  };

  // Function to verify OTP
  const verifyOTP = async () => {
    try {
      const credential = await user.confirm(otp);
      console.log('Verification successful:', credential);
      setSuccessMessage('OTP verified successfully!');
      setErrorMessage('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('OTP verification failed. Please enter the correct OTP.');
    }
  };

  // Return the JSX for rendering
  return (
    <div className="container">
      <div className="first-half">
        <div className="app-title">Welcome to NEW APP</div>
      </div>
      <div className="second-half">
        <div className="content">
          {/* Phone input field */}
          <div className="phone-input-wrapper">
            <label htmlFor="phoneInput">Please type your mobile number</label>
            <PhoneInput
              id="phoneInput"
              country={'in'}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputProps={{ className: 'phone-input' }}
            />
          </div>
          {/* Button to send OTP */}
          <button className="button" onClick={sendOTP}>Send OTP</button>
          <div id='recaptcha'></div> 
          {/* Input field for OTP */}
          <input
            id="otpInput"
            type='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder='Enter OTP'
            className="input-box"
          />
          {/* Button to verify OTP */}
          <button className="button" onClick={verifyOTP}>Verify OTP</button>
          {/* Display success message */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {/* Display error message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

// Export the Login component
export default Login;
