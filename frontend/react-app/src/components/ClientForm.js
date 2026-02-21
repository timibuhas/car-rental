import React, { useState } from "react";
import "../css/ClientForm.css";

function ClientForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    cnp: "",
    adresa: "",
    telefon: "",
    email: "",
    status: "activ"
  });


   // Handle add new client
   const handleAddClient = async () => {
    try {
      const response = await fetch("http://localhost:5000/clienti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add client");
      }

      const savedClient = await response.json();
      console.log(savedClient)
      onSubmit(savedClient)
      
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  const handleChange = (e) => {
    console.log(formData)
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddClient(); // Pass data back to parent
    onClose(); // Close the pop-up
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h2>Adauga client</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nume:</label>
            <input
              type="text"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prenume:</label>
            <input
              type="text"
              name="prenume"
              value={formData.prenume}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>CNP:</label>
            <input
              type="text"
              name="cnp"
              value={formData.cnp}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Adresa:</label>
            <input
              type="text"
              name="adresa"
              value={formData.adresa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Telefon:</label>
            <input
              type="tel"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="activ">Activ</option>
              <option value="inactiv">Inactiv</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn primary">Adauga</button>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;
