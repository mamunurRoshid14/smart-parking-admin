import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { auth } from "./firebase";
import Homepage from "./components/Homepage";
import AddUser from "./components/AddUser";
import ViewReport from "./components/ViewReport";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const handleAuthKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Router>
      <div className="app">
        {user ? (
          <div>
            <nav className="nav">
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/add-user" className="nav-link">
                  Add New User
                </Link>
                <Link to="/view-report" className="nav-link">
                  View Report
                </Link>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </nav>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/view-report" element={<ViewReport />} />
            </Routes>
          </div>
        ) : (
          <div className="auth-container">
            <div className="auth-box">
              <h1 className="auth-title">Login / Signup</h1>
              {error && <p className="error">{error}</p>}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleAuthKeyPress}
                placeholder="Email"
                className="input"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleAuthKeyPress}
                placeholder="Password"
                className="input"
              />
              <div className="auth-buttons">
                <button onClick={handleLogin} className="button login-button">
                  Login
                </button>
                <button onClick={handleSignup} className="button signup-button">
                  Signup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
