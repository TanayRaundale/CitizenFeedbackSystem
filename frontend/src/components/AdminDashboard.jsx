import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuIcon from "@mui/icons-material/Menu";
import { blue, blueGrey } from "@mui/material/colors";
import { motion } from "framer-motion";


// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: "#e91e63", // Pink accent - can be changed
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#03a9f4",
    },
    background: {
      default: blueGrey[50],
    },
    text: {
      primary: blueGrey[900],
      secondary: blueGrey[700],
      hint: blueGrey[500],
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    body2: {
      color: blueGrey[700],
    },
    caption: {
      color: blueGrey[500],
      fontSize: "0.8rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Added subtle shadow
          transition: "all 0.3s ease", // Added smooth transition
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Increased shadow on hover
            transform: "scale(1.03)", // Subtle scale-up on hover
          },
        },
        containedPrimary: { // Style for primary buttons
          color: "#fff", // White text for better contrast
          backgroundColor: blue[500],
          "&:hover": {
            backgroundColor: blue[600], // Darker blue on hover
          },
        },
        containedSecondary: { // Style for secondary buttons
          color: "#fff",
          backgroundColor: "#e91e63", // Pink accent color
          "&:hover": {
            backgroundColor: "#d81b60", // Darker pink on hover
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: blue[700],
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: blueGrey[300],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: blue[300],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: blue[500],
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPagination-ul": {
            "& .MuiButtonBase-root.Mui-selected": {
              backgroundColor: blue[300],
              color: "#fff",
              "&:hover": {
                backgroundColor: blue[400],
              },
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: blueGrey[100],
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: blue[200],
            "&:hover": {
              backgroundColor: blue[300],
            },
          },
          "&:hover": {
            backgroundColor: blue[100],
          },
        },
      },
    },
  },
});


const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  borderRadius: "6px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Added subtle shadow
  transition: "all 0.3s ease", // Added smooth transition
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Increased shadow on hover
    transform: "scale(1.03)", // Subtle scale-up on hover
  },
}));


const itemsPerPage = 7; // Increased items per page for a less cluttered look


const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);


  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("adminToken");


    if (!token) {
      alert("You must be logged in to access this page");
      navigate("/adminlogin");
      return;
    }


    setAdminId(storedAdminId);
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/admin/feedbacks?admin_id=<span class="math-inline">\{storedAdminId\}&page\=</span>{page}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setFeedbacks(response.data);
          setTotalItems(response.headers["x-total-count"] || response.data.length || 0);
          const initialStatuses = response.data.reduce((acc, feedback) => {
            acc[feedback.fed_id] = feedback.status;
            return acc;
          }, {});
          setStatuses(initialStatuses);
        } else {
          console.warn("API response data is missing or not an array:", response);
          setFeedbacks([]);
          setTotalItems(0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setLoading(false);
        setFeedbacks([]);
        setTotalItems(0);
      });
  }, [navigate, page, adminId, itemsPerPage]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleStatusChange = (fed_id, newStatus) => {
    if (["Pending", "InProgress", "Resolved"].includes(newStatus)) {
      setStatuses((prev) => ({ ...prev, [fed_id]: newStatus }));
    }
  };


  const applyStatusChanges = () => {
    Object.keys(statuses).forEach((fed_id) => {
      axios
        .put(
          `http://localhost:8000/admin/feedbacks/${fed_id}/status`,
          { status: statuses[fed_id] },
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        )
        .then(() => {
          console.log(`Status for feedback ${fed_id} updated successfully`);
        })
        .catch((error) => {
          console.error(`Error updating status for feedback ${fed_id}:`, error);
        });
    });
    alert("All status updates applied successfully");
  };


  const handleDeleteFeedback = (fed_id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      axios
        .delete(`http://localhost:8000/admin/feedbacks/${fed_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        })
        .then(() => {
          setFeedbacks(feedbacks.filter((feedback) => feedback.fed_id !== fed_id));
          setTotalItems(totalItems - 1);
          alert("Feedback deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting feedback:", error);
        });
    }
  };


  const handleViewFeedback = (fed_id) => {
    navigate(`/admin/feedback/${fed_id}`);
  };


  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    alert("Logout successful");
    navigate("/adminlogin");
  };


  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };


  const drawerList = (
    <Box
      sx={{ width: 240 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button key="Dashboard" component={Link} to="/admin/dashboard" selected={location.pathname === "/admin/dashboard"}>
          <ListItemIcon><VisibilityIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem button key="Analysis" component={Link} to="/admin/analysis" selected={location.pathname === "/admin/analysis"}>
          <ListItemIcon><AssessmentIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Analysis" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem button key="Logout" onClick={handleLogout}>
          <ListItemIcon><LogoutIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItem>
      </List>
    </Box>
  );


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {drawerList}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: { sm: '64px' } }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
              <CircularProgress color="primary" />
            </Box>
          ) : !feedbacks ? (
            <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
              Error loading feedbacks. Please try again.
            </Typography>
          ) : feedbacks.length === 0 && !loading ? (
            <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
              No feedbacks assigned to you.
            </Typography>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h4" gutterBottom color="primary">
                Complaint Management
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="feedback table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Feedback ID</TableCell>
                      <TableCell>Submitted By (Adhar No)</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedbacks.map((feedback) => (
                      <TableRow
                        key={feedback.fed_id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" fontWeight="bold" color="text.primary">
                          {feedback.fed_id}
                        </TableCell>
                        <TableCell color="text.secondary">{feedback.adhar_no}</TableCell>
                        <TableCell>
                          <Select
                            value={statuses[feedback.fed_id]}
                            onChange={(e) => handleStatusChange(feedback.fed_id, e.target.value)}
                            size="small"
                            variant="outlined"
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="InProgress">In Progress</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="right">
                          <ActionButton
                            variant="contained"
                            color="info"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewFeedback(feedback.fed_id)}
                            size="small"

                          >
                            View
                          </ActionButton>
                          <ActionButton
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteFeedback(feedback.fed_id)}
                            size="small"
                          >
                            Delete
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>


              {totalPages > 1 && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}


              <Box mt={3} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyStatusChanges}
                >
                  Apply Status Changes
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};


export default AdminDashboard;