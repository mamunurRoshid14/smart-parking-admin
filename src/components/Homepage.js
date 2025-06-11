import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="container">
      <h1 className="title">Welcome to the RFID Management System</h1>
      <div className="button-grid">
        <Link to="/add-user" className="home-button add-user-button">
          Add New User
        </Link>
        <Link to="/view-report" className="home-button view-report-button">
          View Report
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
