import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import UserLogin from "./components/UserLogin";
import AdminLogin from "./components/AdminLogin";
import Signup from "./components/SignUp";
import UserFormFeedback from "./components/UserFormFeedback";
import Contactus from "./components/Contactus";
import Services from "./components/Services";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/userlogin" element={<UserLogin/>} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<UserFormFeedback />} />
        <Route path="/dashboard/home" element={<UserFormFeedback />} />
        <Route path="/dashboard/services" element={<Services />} />
        <Route path="/dashboard/contactus" element={<Contactus/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path ="/adminlogin" element={<AdminLogin/>} />
        
      </Routes>
    </Router>
  );
};

export default App;
