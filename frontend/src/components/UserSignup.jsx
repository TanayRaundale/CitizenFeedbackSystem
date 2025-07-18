import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Box, TextField, Button, Typography, Paper, Container } from "@mui/material";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    adhar_no: "",
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/usersignup", formData);
      alert("Signup successful");
      navigate("/userlogin");
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <Box sx={{ background: "linear-gradient(to right, #1e3c72, #2a5298)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <Paper elevation={10} sx={{ padding: 4, borderRadius: 3, textAlign: "center", background: "rgba(255, 255, 255, 0.95)" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2, color: "#1e3c72" }}>
            User Signup
          </Typography>
          <Container>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Aadhar Number" name="adhar_no" value={formData.adhar_no} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
              <TextField fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} margin="normal" required multiline rows={2} />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2, background: "#1e3c72", color: "white" }}>
                  Signup
                </Button>
              </motion.div>
            </form>
          </Container>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default UserSignup;
