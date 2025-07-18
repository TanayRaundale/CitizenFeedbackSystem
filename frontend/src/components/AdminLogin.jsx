import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  styled,
  keyframes,
} from "@mui/material";
import { deepPurple, teal, amber } from "@mui/material/colors";
import { AdminPanelSettings } from "@mui/icons-material";

// Keyframes for subtle pulsing animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

// Keyframes for colorful loader rotation
const colorfulRotate = keyframes`
  0% {
    stroke: ${amber[400]};
  }
  25% {
    stroke: ${teal[400]};
  }
  50% {
    stroke: ${deepPurple[400]};
  }
  75% {
    stroke: ${amber[400]};
  }
  100% {
    stroke: ${teal[400]};
  }
`;

// Styled Components with enhanced aesthetics
const GradientBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: `linear-gradient(45deg, ${deepPurple[600]} 30%, ${teal[500]} 90%)`,
  padding: theme.spacing(3),
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: 400,
  maxWidth: "90%",
  textAlign: "center",
  borderRadius: theme.spacing(2),
  boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15)`,
  backgroundColor: theme.palette.mode === "dark" ? "#303030" : "#fff",
}));

const LogoBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const Logo = styled(AdminPanelSettings)(({ theme }) => ({
  fontSize: 60,
  color: theme.palette.primary.main,
}));

const LoginTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },
}));

const LoginButtonWrapper = styled(motion.div)(({ theme }) => ({
  marginTop: theme.spacing(3),
  position: "relative",
  display: "flex", // Added flex to align button and loader
  flexDirection: "column", // Stack button and loader vertically
  alignItems: "center", // Center items horizontally
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2), // Add some space above the loader
}));

const ColorfulLoader = styled(CircularProgress)(({ theme }) => ({
  animation: `${colorfulRotate} 1.4s linear infinite`,
  color: theme.palette.secondary.main, // Use secondary color for loader
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

const SuccessText = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", response.data.access_token);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <GradientBox>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
      >
        <LoginPaper elevation={16}>
          <LogoBox>
            <Logo color="primary" />
          </LogoBox>
          <LoginTitle variant="h4" align="center">
            Admin Login
          </LoginTitle>
          {error && <ErrorText>{error}</ErrorText>}
          {success && <SuccessText>{success ? "Login successful! Redirecting..." : ""}</SuccessText>}
          <form onSubmit={handleLogin}>
            <StyledTextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <StyledTextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <LoginButtonWrapper whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={loading}
              >
                Login
              </Button>
              {loading && (
                <LoaderContainer>
                  <ColorfulLoader size={30} />
                </LoaderContainer>
              )}
            </LoginButtonWrapper>
          </form>
        </LoginPaper>
      </motion.div>
    </GradientBox>
  );
};

export default AdminLogin;