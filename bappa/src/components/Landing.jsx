import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E3F2FD, #EDE7F6)",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      {/* Top Heading */}
      <Typography variant="h3" fontWeight="700" color="#1E88E5" mb={4}>
        Citizen Feedback System
      </Typography>

      {/* Main Container */}
      <Paper
        elevation={10}
        sx={{
          width: "85%",
          maxWidth: "900px",
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          minHeight: "450px",
          backgroundColor: "#fff",
        }}
      >
        {/* Left Side - Image Placeholder */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#E3F2FD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          <img
            src="/root.png"
            alt="Feedback Illustration"
            style={{ width: "100%", maxWidth: "280px", borderRadius: "10px" }}
          />
        </Box>

        {/* Right Side - Login Options */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <Typography variant="h5" fontWeight="600" color="#333" mb={3}>
            Choose Your Role
          </Typography>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#64B5F6",
                color: "#fff",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: "bold",
                width: "250px",
                boxShadow: "0px 4px 10px rgba(100, 181, 246, 0.5)",
                "&:hover": { backgroundColor: "#42A5F5" },
              }}
              onClick={() => navigate("/userlogin")}
            >
              User Login
            </Button>
          </motion.div>

          <Box mt={2}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#AB47BC",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  width: "250px",
                  boxShadow: "0px 4px 10px rgba(171, 71, 188, 0.5)",
                  "&:hover": { backgroundColor: "#9C27B0" },
                }}
                onClick={() => navigate("/adminlogin")}
              >
                Admin Login
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Landing;
