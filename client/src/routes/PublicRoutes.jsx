import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import Login from "../pages/PublicPages/Login.jsx";
import Register from "../pages/PublicPages/Register.jsx";
import LandingPage from "../pages/PublicPages/LandingPage.jsx";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
