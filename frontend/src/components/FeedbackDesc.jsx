import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress, Button, AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const FeedbackDesc = () => {
  const { id } = useParams(); // Get feedback ID from URL
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("You must be logged in to access this page");
      navigate("/admin/login");
      return;
    }

    axios
      .get(`http://localhost:8000/admin/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFeedback(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedback details:", error);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    alert("Logout successful");
    navigate("/adminlogin");
  };

  return (
    <Box sx={{ background: "linear-gradient(to right, #1e3c72, #2a5298)", minHeight: "100vh", padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AppBar position="static" sx={{ background: "#1e3c72", padding: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>Complaint Details</Typography>
          <IconButton onClick={handleLogout} sx={{ color: "white" }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {loading ? (
        <CircularProgress sx={{ marginTop: 4 }} />
      ) : (
        feedback && (
          <Paper sx={{ padding: 4, marginTop: 4, borderRadius: 3, background: "rgba(255, 255, 255, 0.95)", boxShadow: "0px 4px 15px rgba(0,0,0,0.3)", width: "50%" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>Feedback ID: {feedback.fed_id}</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Status:</strong> {feedback.status}</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Aadhar No:</strong> {feedback.adhar_no}</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Submitted At:</strong> {new Date(feedback.fed_date).toLocaleString()}</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginTop: 2 }}>Description:</Typography>
            <Typography variant="body1" sx={{ padding: 2, background: "#f4f4f4", borderRadius: 2 }}>{feedback.feedback_description}</Typography>

            {feedback.latitude && feedback.longitude && (
              <Box sx={{ marginTop: 2, display: "flex", alignItems: "center" }}>
                <Typography variant="body1">
                  <strong>Coordinates:</strong> {feedback.latitude}, {feedback.longitude}
                </Typography>
                <Tooltip title="View location on map">
                  <IconButton
                    sx={{ marginLeft: 1, color: "#1565C0" }}
                    onClick={() => window.open(`https://www.google.com/maps?q=${feedback.latitude},${feedback.longitude}`, "_blank")}
                  >
                    <LocationOnIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</Button>
          </Paper>
        )
      )}
    </Box>
  );
};

export default FeedbackDesc;
