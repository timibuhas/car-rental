import React, { useState, useEffect} from "react";
import InchirieriForm from "../components/InchirieriForm";
import { toLocalDateTimeString } from "../utils/dateConversion";
import { format } from "date-fns";
import { fetchApi } from "../utils/fetchApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

function InchirieriPage({activeUser}) {
  const [clients, setClients] = useState([]);
  const [autoturisme, setAutoturisme] = useState([]);
  const [inchirieri, setInchirieri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalsResponse = await fetch(`http://localhost:5000/inchirieri/${activeUser.userId}`);
    
        if (!rentalsResponse.ok) {
          throw new Error("Failed to fetch rentals");
        }
    
        const rentalsData = await rentalsResponse.json();
        const { clients, autoturisme } = await fetchApi();
        setClients(clients);
        setAutoturisme(autoturisme);
        setInchirieri(rentalsData); // Set rentals in state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    // Call fetchData when the component mounts
    if (activeUser?.userId) {
      fetchData();
    }
    
  }, [activeUser.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRental((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(value)
  };



  function formatDate(date) {
    return format(new Date(date), "dd-MM-yyyy HH:mm"); // Example format: 01-01-1970 15:47
  }
  
  const handleEditRental = (rental) => {
    console.log(rental)
   setSelectedRental(rental)
    setShowEditForm(true);
  };

  const handleUpdateRental = async () => {

    try {
      const response = await fetch(`http://localhost:5000/inchirieri/${selectedRental.inchiriereId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRental),
      });

      if (!response.ok) {
        throw new Error("Failed to update rental");
      }

      const updatedRental = await response.json();
      console.log(updatedRental)
      setInchirieri((prev) =>
        prev.map((rental) =>
          rental.inchiriereId === updatedRental.inchiriereId ? updatedRental : rental
        )
      );
      setShowEditForm(false);

    } catch (err) {
      console.error("Error updating rental:", err);
    }
  };

  const handleDeleteRental = async (id) => {
    if (window.confirm("Are you sure you want to delete this rental?")) {
      try {
        const response = await fetch(`http://localhost:5000/inchirieri/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete rental");
        }

        setInchirieri((prev) => prev.filter((rental) => rental.inchiriereId !== id));
      } catch (err) {
        console.error("Error deleting rental:", err);
      }
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div>
      <div className="centered-container">
      <h1>Inchirieri</h1>
      <Button variant="contained" color="primary" onClick={() => setShowAddForm(true)}>
        Adauga
      </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Autoturism</strong></TableCell>
              <TableCell><strong>Data Start</strong></TableCell>
              <TableCell><strong>Data End</strong></TableCell>
              <TableCell><strong>Cost Total</strong></TableCell>
              <TableCell><strong>Observatii</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inchirieri.map((inchiriere) => (
              <TableRow key={inchiriere.inchiriereId}>
                <TableCell>{inchiriere.inchiriereId}</TableCell>
                <TableCell>{inchiriere.client.nume}</TableCell>
                <TableCell>{inchiriere.autoturism.marca} {inchiriere.autoturism.model} {inchiriere.autoturism.numarInmatriculare}</TableCell>
                <TableCell>{formatDate(inchiriere.dataStart)}</TableCell>
                <TableCell>{formatDate(inchiriere.dataEnd)}</TableCell>
                <TableCell>{inchiriere.costTotal}</TableCell>
                <TableCell>{inchiriere.observatii}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEditRental(inchiriere)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteRental(inchiriere.inchiriereId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Rental Dialog */}
      {showEditForm && (
        <Dialog open={showEditForm} onClose={() => setShowEditForm(false)}>
          <DialogTitle>Modifica inchiriere</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Client</InputLabel>
              <Select
                name="clientId"
                value={selectedRental.clientId}
                onChange={handleInputChange}
                required
              >
                {clients.map((client) => (
                  <MenuItem key={client.clientId} value={client.clientId}>
                    {client.nume} {client.prenume}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Autoturism</InputLabel>
              <Select
                name="autoturismId"
                value={selectedRental.autoturismId}
                onChange={handleInputChange}
                required
              >
                {autoturisme.map((car) => (
                  <MenuItem key={car.autoturismId} value={car.autoturismId}>
                    {car.marca} {car.model} - {car.numarInmatriculare}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Data Start"
              name="dataStart"
              type="datetime-local"
              value={toLocalDateTimeString(selectedRental.dataStart)}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Data End"
              name="dataEnd"
              type="datetime-local"
              value={toLocalDateTimeString(selectedRental.dataEnd)}
              onChange={handleInputChange}
              fullWidth
              required           
            />
            <TextField
              margin="dense"
              label="Cost Total"
              name="costTotal"
              type="number"
              value={selectedRental.costTotal}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Observatii"
              name="observatii"
              value={selectedRental.observatii}
              onChange={handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditForm(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateRental} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showAddForm && (
        <InchirieriForm
          activeUser={activeUser}
          onClose={() => setShowAddForm(false)}
          onSubmit={(savedRental)=>setInchirieri([...inchirieri, savedRental])}
        />
      )}
      
    </div>
  );
}

export default InchirieriPage;
