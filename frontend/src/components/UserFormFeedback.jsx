import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Alert, Snackbar, Select, MenuItem, IconButton, AppBar, Toolbar } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";

const UserFormFeedback = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [adharNo, setAdharNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const categories = ["Waste Management", "Infrastructure", "Water Supply", "Electricity", "Road Maintenance"];

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("You are not logged in. Redirecting to login...");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in first.");
        setLoading(false);
        return;
      }
      await axios.post("http://127.0.0.1:8000/submitfeedback", {
        adhar_no: adharNo,
        dept_name: category,
        feedback_description: message,
        latitude: location.latitude,
        longitude: location.longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategory("");
      setMessage("");
      setAdharNo("");
      setLocation({ latitude: null, longitude: null });
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout successful");
    navigate("/userlogin");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        () => alert("Failed to fetch location. Please enter manually."),
      );
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", background: "#E3F2FD", padding: "20px" }}>
      <AppBar position="static" sx={{ background: "#1E88E5", padding: 1, width: "100%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>User Complaint
          </Typography>
          <IconButton onClick={handleLogout} sx={{ color: "white" }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper elevation={10} sx={{ width: "400px", padding: "30px", borderRadius: "15px", textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h5" fontWeight="600" color="#1E88E5" mb={2}>Submit Complaint</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert severity="success">Complaint submitted successfully!</Alert>
        </Snackbar>

        <TextField fullWidth label="Aadhar Number" variant="outlined" value={adharNo} onChange={(e) => setAdharNo(e.target.value)} sx={{ mb: 2 }} />

        <Select fullWidth displayEmpty value={category} onChange={(e) => setCategory(e.target.value)} sx={{ mb: 2 }}>
          <MenuItem value="" disabled>Select a Category</MenuItem>
          {categories.map((cat, index) => (<MenuItem key={index} value={cat}>{cat}</MenuItem>))}
        </Select>

        <TextField fullWidth label="Feedback Message" multiline rows={4} variant="outlined" sx={{ mb: 2 }} value={message} onChange={(e) => setMessage(e.target.value)} />

        <Button variant="contained" sx={{ mb: 2 }} onClick={getCurrentLocation}>Use Current Location</Button>

        {location.latitude && location.longitude && (
          <Typography variant="body2" color="textSecondary">
            Location: {location.latitude}, {location.longitude}
          </Typography>
        )}

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="contained" fullWidth sx={{ backgroundColor: "#1E88E5", color: "#fff", padding: "10px", borderRadius: "10px", fontWeight: "bold", "&:hover": { backgroundColor: "#1565C0" } }} onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit Complaint"}
          </Button>
        </motion.div>
      </Paper>
    </Box>
  );
};

export default UserFormFeedback;
