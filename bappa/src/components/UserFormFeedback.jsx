import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Snackbar, Alert, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

const UserFeedbackForm = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [adharNo, setAdharNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Waste Management",
    "Infrastructure",
    "Water Supply",
    "Electricity",
    "Road Maintenance",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in first.");
        setLoading(false);
        return;
      }

      await axios.post("http://127.0.0.1:3000/submitfeedback", {
        adhar_no: adharNo,
        dept_name: category,
        feedback_description: message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setCategory("");
      setMessage("");
      setAdharNo("");
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E3F2FD, #EDE7F6)",
        fontFamily: "Roboto Slab",
        padding: "20px",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "400px",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="600" color="#1E88E5" mb={2}>
          Submit Feedback
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Aadhar Number"
          variant="outlined"
          value={adharNo}
          onChange={(e) => setAdharNo(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Select
          fullWidth
          displayEmpty
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            Select a Category
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>

        <TextField
          fullWidth
          label="Feedback Message"
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#1E88E5",
              color: "#fff",
              padding: "10px",
              borderRadius: "10px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#1565C0" },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit Feedback"}
          </Button>
        </motion.div>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ fontWeight: "light" }}>
          Feedback Submitted Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserFeedbackForm;
