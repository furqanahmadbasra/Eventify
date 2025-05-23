import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    if (json.success === true) {
      localStorage.setItem('token', json.jwt_auth_token);
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login__container">
      <div className="login__form-wrapper">
        <header className="login__header">Login</header>
        <form onSubmit={handleSubmit} className="login__form">

          <input
            type="text"
            className="login__input login__input-email"
            placeholder="Enter your email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            required
          />

          <input
            type="password"
            className="login__input login__input-password"
            placeholder="Enter your password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            required
          />

          <input
            type="submit"
            className="login__submit-btn"
            value="Login"
          />
        </form>

        <div className="login__footer">
          <span>
            Don’t have an account? <Link to="/signup" className="login__signup-link">Signup</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
