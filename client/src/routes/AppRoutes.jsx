import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import SetupGuard from "./SetupGuard";
import FirstLogin from "../pages/AppPages/FirstLogin";
import Dashboard from "../pages/AppPages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="firstlogin" element={<FirstLogin />} />
        <Route element={<SetupGuard />}>
          <Route path="dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
