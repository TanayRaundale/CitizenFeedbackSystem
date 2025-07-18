import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Link, CircularProgress, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";
const UserLogin = () => {
  const navigate = useNavigate();
  const [adharNo, setAdharNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Snackbar state

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        adhar_no: adharNo,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("adhar_no", adharNo);


      setSuccess(true); // Show success message
      setTimeout(() => navigate("/dashboard"), 2000); // Navigate after 2 seconds
    } catch (err) {
      setError("Invalid Aadhar Number or Password");
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
          User Login
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
          sx={{ mb: 2 }}
          value={adharNo}
          onChange={(e) => setAdharNo(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
          </Button>
        </motion.div>

        <Typography variant="body2" mt={2}>
          Don't have an account?{" "}
          <Link
            component="button"
            variant="body2"
            sx={{ color: "#1E88E5", fontWeight: "600", cursor: "pointer" }}
            onClick={() => navigate("/user/signup")}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={2000} // Auto-hide after 2 seconds
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ fontWeight: "light"}}>
          Login Successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserLogin;
