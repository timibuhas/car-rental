import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import "../css/LoginPanel.css";


const API_URL = process.env.API_URL;
const LoginPanel = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Login failed.");
        return;
      }

      const loggedInUser = await response.json();
      setError("");
      onLogin(loggedInUser); // Notify App.js about the logged-in user

      // Redirect to Home after successful login
      navigate("/");
    } catch (err) {
      setError("Am intampinat o eroare. Incearca din nou");
    }
  };

  return (
    <div className="login-panel">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Introdu numele"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Introdu parola"
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="switch-panel">
        Nu ai un cont? <Link to="/register">Inregistreaza-te aici</Link>
      </p>
    </div>
  );
};

export default LoginPanel;
