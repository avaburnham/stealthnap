import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Gear from './pages/Gear';
import Locations from './pages/Locations';
import Login from './pages/login'; // <-- Make sure path is correct

function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <h1 className="text-center fw-bold">
        For the bold and brave.
      </h1>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [email, setEmail] = useState(localStorage.getItem('email') || '');

  const handleLogin = (jwt, userId, email) => {
    setToken(jwt);
    setUserId(userId);
    setEmail(email);
    localStorage.setItem('token', jwt);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    setToken(null);
    setUserId(null);
    setEmail('');
  };

  return (
    <BrowserRouter>
      {/* ✅ Logout and login info above navbar */}
      {token && (
        <div className="bg-light px-3 pt-2 pb-3 border-bottom text-end">
          <button className="btn btn-outline-secondary btn-sm mb-1" onClick={handleLogout}>
            Logout
          </button>
          {email && (
            <div className="text-secondary small">
              Logged in as: <span className="fw-semibold">{email}</span>
            </div>
          )}
        </div>
      )}

      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">StealthNap</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/gear">Gear</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/locations">Locations</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        {!token ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gear" element={<Gear />} />
            <Route path="/locations" element={<Locations />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}
