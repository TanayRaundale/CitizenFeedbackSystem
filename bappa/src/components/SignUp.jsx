import React from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

const Signup = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFECB3, #FFE0B2)",
        fontFamily: "'Poppins', sans-serif",
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
        <Typography variant="h5" fontWeight="600" color="#FF9800" mb={2}>
          User Sign Up
        </Typography>

        <TextField fullWidth label="Full Name" variant="outlined" sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#FF9800",
              color: "#fff",
              padding: "10px",
              borderRadius: "10px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#F57C00" },
            }}
          >
            Sign Up
          </Button>
        </motion.div>
      </Paper>
    </Box>
  );
};

export default Signup;
