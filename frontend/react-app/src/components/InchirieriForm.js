import React, { useState, useEffect } from "react";
import { toLocalDateTimeString } from "../utils/dateConversion";
import { fetchApi } from "../utils/fetchApi";
import "../css/ClientForm.css";
import {
    TextField,
    MenuItem,
    Select,
    FormControl

  } from "@mui/material";
function InchirieriForm({ onClose, onSubmit,activeUser }) {
 
  const [clients, setClients] = useState([]);
  const [autoturisme, setAutoturisme] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "",
    autoturismId: "",
    dataStart: "",
    dataEnd: "",
    costTotal: "",
    observatii: "",
    userId:activeUser.userId
  });


  useEffect(() => {
    const loadData = async () => {
      try {
        const { clients, autoturisme } = await fetchApi();
        setClients(clients);
        setAutoturisme(autoturisme);

      } catch (err) {
       console.log(err)
      }
    };

    loadData();
  }, []);
   // Handle add new client
  const handleAddRental = async () => {
    console.log(formData)
    try {
      const response = await fetch("http://localhost:5000/inchirieri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add rental");
      }

      const savedRental = await response.json();
      console.log(savedRental)
      onSubmit(savedRental)
    } catch (err) {
      console.error("Error adding rental:", err);
    }
  };

  const handleChange = (e) => {
    console.log(formData)
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddRental(); 
    onClose(); // Close the pop-up
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h2>Adauga inchiriere</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client:</label>
            <FormControl fullWidth margin="dense">
            <Select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
              >
                {clients.map((client) => (
                  <MenuItem key={client.clientId} value={client.clientId}>
                    {client.nume} {client.prenume}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
          </div>
          <div className="form-group">
            <label>Autoturism:</label>
            <FormControl fullWidth margin="dense">
            <Select
                name="autoturismId"
                value={formData.autoturismId}
                onChange={handleChange}
                required
              >
                {autoturisme.map((car) => (
                  <MenuItem key={car.autoturismId} value={car.autoturismId}>
                    {car.marca} {car.model} - {car.numarInmatriculare}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
          </div>
          <div className="form-group">
            <label>Data start:</label>
            <TextField
              margin="dense"
              name="dataStart"
              type="datetime-local"
              value={toLocalDateTimeString(formData.dataStart)}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <label>Data end:</label>
            <TextField
              margin="dense"
              name="dataEnd"
              type="datetime-local"
              value={toLocalDateTimeString(formData.dataEnd)}
              onChange={handleChange}
              fullWidth
              required           
            />
          </div>
          <div className="form-group">
            <label>Cost total:</label>
            <input
              type="text"
              name="costTotal"
              value={formData.costTotal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Observatii:</label>
            <input
              type="text"
              name="observatii"
              value={formData.observatii}
              onChange={handleChange}
              required
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

export default InchirieriForm;
