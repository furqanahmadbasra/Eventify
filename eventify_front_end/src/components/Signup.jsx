import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    const [passError, setPassError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;

        if (password !== cpassword) {
            setPassError(true);
            return;
        }

        setPassError(false);

        try {
            const response = await fetch("https://eventify-ymsb.vercel.app/api/auth/createuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password })
            });

            const json = await response.json();

            if (json.success === true) {
                localStorage.setItem('token', json.jwt_auth_token);
                navigate("/home");
            } else {
                alert("Invalid credentials");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Something went wrong. Please try again later.");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

        if (e.target.name === "cpassword" || e.target.name === "password") {
            if (credentials.password === credentials.cpassword) {
                setPassError(false);
            }
        }
    };

    return (
        <div className="signup__container">
            <div className="signup__form-wrapper">
                <header className="signup__header">Signup</header>
                <form onSubmit={handleSubmit} className="signup__form">

                    <input
                        type="text"
                        className="signup__input signup__name"
                        placeholder="Enter your name"
                        name="name"
                        onChange={onChange}
                        required
                    />

                    <input
                        type="email"
                        className="signup__input signup__email"
                        placeholder="Enter your email"
                        name="email"
                        onChange={onChange}
                        required
                    />

                    <input
                        type="password"
                        className="signup__input signup__password"
                        placeholder="Create a password"
                        name="password"
                        onChange={onChange}
                        required
                    />

                    <input
                        type="password"
                        className="signup__input signup__cpassword"
                        placeholder="Confirm your password"
                        name="cpassword"
                        onChange={onChange}
                        required
                        style={{ borderColor: passError ? 'red' : '#ddd' }}
                    />

                    {passError && (
                        <p className="signup__error-msg">
                            Passwords do not match
                        </p>
                    )}

                    <input
                        type="submit"
                        className="signup__submit-btn"
                        value="Signup"
                    />
                </form>
                <div className="signup__footer">
                    <span>
                        Already have an account? <Link to="/login" className="signup__login-link">Login</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
