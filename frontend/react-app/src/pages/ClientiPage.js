import React, { useState, useEffect } from "react";
import ClientForm from "../components/ClientForm";
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
} from "@mui/material";

function ClientsPage() {
  const [clients, setClients] = useState([]); // Store fetched clients
  const [showForm, setShowForm] = useState(false); // Manage add form visibility
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Handle errors
  const [openDialog, setOpenDialog] = useState(false); // Manage update dialog visibility
  const [selectedClient, setSelectedClient] = useState(null); // Store selected client for update

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:5000/clienti");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const response = await fetch(`http://localhost:5000/clienti/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete client");
        }
        setClients(clients.filter((client) => client.clientId !== id));
      } catch (err) {
        console.error("Error deleting client:", err);
      }
    }
  };

  // Handle opening the update dialog
  const handleEdit = (client) => {
    setSelectedClient(client);
    setOpenDialog(true);
  };

  // Handle closing the update dialog
  const handleCloseDialog = () => {
    setSelectedClient(null);
    setOpenDialog(false);
  };

  // Handle update input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  // Submit the updated client
  const handleUpdateSubmit = async () => {
    console.log(selectedClient)
    try {
      const response = await fetch(
        `http://localhost:5000/clienti/${selectedClient.clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedClient),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update client");
      }

      const updatedClient = await response.json();

      // Update the client in the local state
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.clientId === updatedClient.clientId ? updatedClient : client
        )
      );

      handleCloseDialog(); // Close the dialog after update
    } catch (err) {
      console.error("Error updating client:", err);
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
      <h1>Clienti</h1>
      <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
        Adauga
      </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nume</strong></TableCell>
              <TableCell><strong>Prenume</strong></TableCell>
              <TableCell><strong>CNP</strong></TableCell>
              <TableCell><strong>Adresa</strong></TableCell>
              <TableCell><strong>Telefon</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.clientId}>
                <TableCell>{client.clientId}</TableCell>
                <TableCell>{client.nume}</TableCell>
                <TableCell>{client.prenume}</TableCell>
                <TableCell>{client.cnp}</TableCell>
                <TableCell>{client.adresa}</TableCell>
                <TableCell>{client.telefon}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(client)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(client.clientId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

     
      {selectedClient && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nume"
              name="nume"
              value={selectedClient.nume || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Prenume"
              name="prenume"
              value={selectedClient.prenume || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="CNP"
              name="cnp"
              value={selectedClient.cnp || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Adresa"
              name="adresa"
              value={selectedClient.adresa || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Telefon"
              name="telefon"
              value={selectedClient.telefon || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={selectedClient.email || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Status"
              name="status"
              value={selectedClient.status || ""}
              onChange={handleInputChange}
              fullWidth
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
        <ClientForm
          onClose={() => setShowForm(false)}
          onSubmit={(savedClient)=>setClients([...clients, savedClient])}
        />
      )}
    </div>
  );
}

export default ClientsPage;
