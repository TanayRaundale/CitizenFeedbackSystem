import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress, Select, MenuItem, Button, AppBar, Toolbar, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [statuses, setStatuses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("You must be logged in to access this page");
      navigate("/admin-login");
      return;
    }

    setAdminId(storedAdminId);
    axios
      .get("http://localhost:8000/admin/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFeedbacks(response.data);
        const initialStatuses = response.data.reduce((acc, feedback) => {
          acc[feedback.fed_id] = feedback.status;
          return acc;
        }, {});
        setStatuses(initialStatuses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setLoading(false);
      });
  }, [navigate]);

  const handleStatusChange = (fed_id, newStatus) => {
    if (["Pending", "InProgress", "Resolved"].includes(newStatus)) {
      setStatuses((prev) => ({ ...prev, [fed_id]: newStatus }));
    }
  };

  const applyStatusChange = (fed_id) => {
    axios
      .put(`http://localhost:8000/admin/feedbacks/${fed_id}/status`, { status: statuses[fed_id] }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      .then(() => {
        alert("Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    alert("Logout successful");
    navigate("/admin-login");
  };

  return (
    <Box sx={{ background: "linear-gradient(to right, #1e3c72, #2a5298)", minHeight: "100vh", padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AppBar position="static" sx={{ background: "#1e3c72", padding: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>Admin Dashboard</Typography>
          <IconButton onClick={handleLogout} sx={{ color: "white" }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: 3, overflow: "hidden", background: "rgba(255, 255, 255, 0.95)", boxShadow: "0px 4px 15px rgba(0,0,0,0.3)", width: "80%" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#1e3c72" }}>
                  <TableCell sx={{ color: "white", fontSize: "0.875rem", fontWeight: "bold" }}>Feedback ID</TableCell>
                  <TableCell sx={{ color: "white", fontSize: "0.875rem", fontWeight: "bold" }}>Current Status</TableCell>
                  <TableCell sx={{ color: "white", fontSize: "0.875rem", fontWeight: "bold" }}>Update Status</TableCell>
                  <TableCell sx={{ color: "white", fontSize: "0.875rem", fontWeight: "bold" }}>Aadhar No</TableCell>
                  <TableCell sx={{ color: "white", fontSize: "0.875rem", fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <motion.tr key={feedback.fed_id} whileHover={{ scale: 1.02 }}>
                    <TableCell>{feedback.fed_id}</TableCell>
                    <TableCell>{feedback.status}</TableCell>
                    <TableCell>
                      <Select value={statuses[feedback.fed_id]} onChange={(e) => handleStatusChange(feedback.fed_id, e.target.value)}>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="InProgress">InProgress</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>{feedback.adhar_no}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => applyStatusChange(feedback.fed_id)}>
                        Apply
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;