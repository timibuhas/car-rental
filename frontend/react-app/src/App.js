import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ClientiPage from './pages/ClientiPage';
import InchirieriPage from './pages/InchirieriPage';
import AutoturismePage from './pages/AutoturismePage';
import LoginPanel from './components/LoginPanel';
import RegisterPanel from './components/RegisterPanel'; // Import RegisterPanel
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage login state
  const [user, setUser] = useState([]);
  const handleLogin = (user) => {
    setIsAuthenticated(true); // Set authentication to true on successful login
    setUser(user)
    console.log(user)
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPanel onLogin={handleLogin} setUser={setUser}  />} />
          <Route path="/register" element={<RegisterPanel />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Home activeUser={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/clienti"
            element={isAuthenticated ? <ClientiPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/inchirieri"
            element={isAuthenticated ? <InchirieriPage activeUser={user}/> : <Navigate to="/login" />}
          />
          <Route
            path="/autoturisme"
            element={isAuthenticated ? <AutoturismePage /> : <Navigate to="/login" />}
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
