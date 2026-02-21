import React, { useState } from "react";
import "../css/RegisterPanel.css";
import { useNavigate } from "react-router-dom";

const RegisterPanel = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (!formData.username || !formData.email || !formData.password) {
      setError("Te rog introdu toate campurile");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Inregistrare esuata.");
        return;
      }

      setSuccess("Utilizator inregistrat cu succes");
      setError("");
      setFormData({ username: "", email: "", password: "" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Am intampinat o eroare. Incearca din nou");
    }
  };

  return (
    <div className="register-panel">
      <h2>Inregistrare</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Introdu numele de utilizator"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Introdu adresa de email"
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

        <button type="submit" className="register-button">
          Inregistreaza-te
        </button>
      </form>
    </div>
  );
};

export default RegisterPanel;
