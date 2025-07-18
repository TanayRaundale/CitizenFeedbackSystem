import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box, CircularProgress, Alert, IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ dept_id: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const departmentInfo = `
    100 - Waste Management\n
    101 - Infrastructure\n
    102 - Water Supply\n
    103 - Electricity\n
    104 - Road Maintenance
  `;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/admin/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/adminlogin"), 2000);
    } catch (err) {
      setError("Failed to register admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "linear-gradient(135deg, #E3F2FD, #EDE7F6)" }}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Paper elevation={10} sx={{ padding: "30px", borderRadius: "15px", textAlign: "center", width: "400px", position: "relative" }}>
          {/* Info Button */}
          <Tooltip title={<pre>{departmentInfo}</pre>} arrow>
            <IconButton sx={{ position: "absolute", top: 10, right: 10, color: "#1E88E5" }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="h5" fontWeight="600" color="#1E88E5" mb={2}>Admin Registration</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Admin Registered Successfully!</Alert>}
          
          <TextField fullWidth label="Department ID" variant="outlined" name="dept_id" value={formData.dept_id} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" variant="outlined" name="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" variant="outlined" name="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="contained" fullWidth sx={{ backgroundColor: "#1E88E5", color: "#fff", fontWeight: "bold", borderRadius: "10px" }} onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register Admin"}
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AdminRegister;
