import React, { useState } from "react";
import "../css/ClientForm.css";

function AutoturismForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    marca: "",
    model: "",
    numarInmatriculare: "",
    tarifPeZi: "",
    disponibil: true
  });

   // Handle add new autoturism
   const handleAddAutoturism = async () => {
    try {
      const response = await fetch("http://localhost:5000/autoturisme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add autoturism");
      }
      
      const savedAutoturism = await response.json();
      onSubmit(savedAutoturism)

    } catch (err) {
      console.error("Error adding autoturism:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox for Disponibil
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddAutoturism(); // Pass data back to parent
    onClose(); // Close the pop-up
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h2>Adauga autoturism</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Marca:</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Numar Inmatriculare:</label>
            <input
              type="text"
              name="numarInmatriculare"
              value={formData.numarInmatriculare}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tarif Pe Zi:</label>
            <input
              type="number"
              name="tarifPeZi"
              value={formData.tarifPeZi}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Disponibil:</label>
            <input
              type="checkbox"
              name="disponibil"
              checked={formData.disponibil}
              onChange={handleChange}
            />
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

export default AutoturismForm;
