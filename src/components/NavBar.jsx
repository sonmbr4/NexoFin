import React from "react";
import { Link } from "../Logic/Link";
import "./NavBar.css";

export const NavBar = () => {
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  // === Render ===
  return (
    <>
      <nav className="bottom-navbar">
        <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Inicio</span>
        </Link>

        <Link to="/transacciones" className="btn-flotante">
          <span className="btn-flotante-icon">+</span>
        </Link>

        <Link
          to="/actividad"
          className={`nav-item ${isActive("/actividad") ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Actividad</span>
        </Link>
      </nav>
    </>
  );
};
