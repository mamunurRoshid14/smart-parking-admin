import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { db } from "../firebase";
import "./AddUser.css";

function AddUser() {
  const [formData, setFormData] = useState({
    userId: "",
    balance: "",
    fullName: "",
    licence_No: "",
    min_balance: "",
    mobile_No: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.userId.trim()) {
        setError("User ID is required");
        return;
      }

      await db
        .collection("authorizedRFIDs")
        .doc(formData.userId)
        .set({
          userId: formData.userId,
          balance: parseFloat(formData.balance) || 0,
          entry_time: firebase.firestore.Timestamp.now(),
          fullName: formData.fullName,
          licence_No: formData.licence_No,
          min_balance: parseFloat(formData.min_balance) || 0,
          mobile_No: formData.mobile_No,
          status: 0,
        });
      setSuccess("User added successfully!");
      setError("");
      setFormData({
        userId: "",
        balance: "",
        fullName: "",
        licence_No: "",
        min_balance: "",
        mobile_No: "",
      });
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Add New User</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="form-container">
        <div className="form-grid">
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="User ID (e.g., 435268F5)"
            className="input"
          />
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Balance"
            className="input"
          />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Full Name"
            className="input"
          />
          <input
            type="text"
            name="licence_No"
            value={formData.licence_No}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Licence Number"
            className="input"
          />
          <input
            type="number"
            name="min_balance"
            value={formData.min_balance}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Minimum Balance"
            className="input"
          />
          <input
            type="text"
            name="mobile_No"
            value={formData.mobile_No}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Mobile Number"
            className="input"
          />
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Add User
        </button>
      </div>
    </div>
  );
}

export default AddUser;
