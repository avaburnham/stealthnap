import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Gear from './pages/Gear';
import Locations from './pages/Locations';

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
  return (
    <BrowserRouter>
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/locations" element={<Locations />} />
      </Routes>
    </BrowserRouter>
  );
}
