import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer, // Import ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f44336",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#00acc1",
    },
    background: {
      default: "#f8f9fa",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: "#333",
    },
    h6: {
      fontWeight: 600,
      color: "#333",
    },
    body1: {
      fontSize: "1rem",
      color: "#555",
    },
  },
});

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("You must be logged in to access this page");
      navigate("/adminlogin");
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:8000/admin/analysis", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAnalysisData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analysis:", error);
        setLoading(false);
      });
  }, [navigate]);

  const pieChartData = analysisData
    ? [
        { name: "Pending", value: analysisData.Pending },
        { name: "Resolved", value: analysisData.Resolved },
        { name: "In Progress", value: analysisData.InProgress },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // Custom Tooltip for better formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: "white", boxShadow: 3 }}>
          <Typography variant="body2">{`${label} : ${payload[0].value.toFixed(2)}%`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
         Complaint Analysis
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : !analysisData ? (
          <Typography variant="h6" align="center" sx={{ mt: 4, color: "#777" }}>
            Error loading analysis. Please try again.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Complaint Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        dataKey="value"
                        label
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Complaint Status Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pieChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} /> {/* Consistent Y-axis */}
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Analysis;