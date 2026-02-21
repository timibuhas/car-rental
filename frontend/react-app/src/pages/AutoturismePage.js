import React, { useState, useEffect } from "react";
import AutoturismForm from "../components/AutoturismForm";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function AutoturismePage() {
  const [autoturisme, setAutoturisme] = useState([]); // Store fetched autoturisme
  const [showForm, setShowForm] = useState(false); // Manage add form visibility
  const [loading, setLoading] = useState(true); // Manage loading state
  
  const [error, setError] = useState(null); // Handle errors
  const [openDialog, setOpenDialog] = useState(false); // Manage update dialog visibility
  const [selectedAutoturism, setSelectedAutoturism] = useState(null); // Store selected autoturism for update

  // Fetch autoturisme from API
  useEffect(() => {
    const fetchAutoturisme = async () => {
      try {
        const response = await fetch("http://localhost:5000/autoturisme");
        if (!response.ok) {
          throw new Error("Failed to fetch autoturisme");
        }
        const data = await response.json();
        setAutoturisme(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAutoturisme();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Sigur doresti sa stergi acest autoturism?")) {
      try {
        const response = await fetch(`http://localhost:5000/autoturisme/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete autoturism");
        }
        setAutoturisme(autoturisme.filter((auto) => auto.autoturismId !== id));
      } catch (err) {
        console.error("Error deleting autoturism:", err);
      }
    }
  };

  // Handle opening the update dialog
  const handleEdit = (autoturism) => {
    setSelectedAutoturism(autoturism);
    setOpenDialog(true);
  };

  // Handle closing the update dialog
  const handleCloseDialog = () => {
    setSelectedAutoturism(null);
    setOpenDialog(false);
  };

  // Handle update input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedAutoturism((prevAutoturism) => ({
      ...prevAutoturism,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit the updated autoturism
  const handleUpdateSubmit = async () => {
    console.log(selectedAutoturism);
    try {
      const response = await fetch(
        `http://localhost:5000/autoturisme/${selectedAutoturism.autoturismId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedAutoturism),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update autoturism");
      }

      const updatedAutoturism = await response.json();

      // Update the autoturism in the local state
      setAutoturisme((prevAutoturisme) =>
        prevAutoturisme.map((auto) =>
          auto.autoturismId === updatedAutoturism.autoturismId ? updatedAutoturism : auto
        )
      );

      handleCloseDialog(); // Close the dialog after update
    } catch (err) {
      console.error("Error updating autoturism:", err);
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
      <h1>Autoturisme</h1>
      <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
        Adauga
      </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Marca</strong></TableCell>
              <TableCell><strong>Model</strong></TableCell>
              <TableCell><strong>Numar Inmatriculare</strong></TableCell>
              <TableCell><strong>Tarif Pe Zi</strong></TableCell>
              <TableCell><strong>Disponibil</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {autoturisme.map((autoturism) => (
              <TableRow key={autoturism.autoturismId}>
                <TableCell>{autoturism.autoturismId}</TableCell>
                <TableCell>{autoturism.marca}</TableCell>
                <TableCell>{autoturism.model}</TableCell>
                <TableCell>{autoturism.numarInmatriculare}</TableCell>
                <TableCell>{autoturism.tarifPeZi}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={autoturism.disponibil}
                    disabled
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(autoturism)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(autoturism.autoturismId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Autoturism Dialog */}
      {selectedAutoturism && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Autoturism</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Marca"
              name="marca"
              value={selectedAutoturism.marca || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Model"
              name="model"
              value={selectedAutoturism.model || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Numar Inmatriculare"
              name="numarInmatriculare"
              value={selectedAutoturism.numarInmatriculare || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Tarif Pe Zi"
              name="tarifPeZi"
              value={selectedAutoturism.tarifPeZi || ""}
              onChange={handleInputChange}
              type="number"
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="disponibil"
                  checked={selectedAutoturism.disponibil || false}
                  onChange={handleInputChange}
                />
              }
              label="Disponibil"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showForm && (
        <AutoturismForm
          onClose={() => setShowForm(false)}
          onSubmit={(savedAutoturism)=>setAutoturisme([...autoturisme, savedAutoturism])}
        />
      )}
    </div>
  );
}

export default AutoturismePage;
