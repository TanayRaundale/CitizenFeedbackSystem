import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const response = await axios.post("http://localhost:8000/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", response.data.access_token);
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ background: "linear-gradient(to right, #8360c3, #2ebf91)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={6} sx={{ padding: 4, width: 380, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Admin Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">Login successful! Redirecting...</Typography>}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: 2, padding: 1, fontWeight: "bold" }}
              >
                Login
              </Button>
            </motion.div>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;