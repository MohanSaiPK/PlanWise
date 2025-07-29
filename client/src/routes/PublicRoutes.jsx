import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
