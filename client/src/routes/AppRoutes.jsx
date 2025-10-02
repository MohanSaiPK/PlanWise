import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import SetupGuard from "./SetupGuard";
import FirstLogin from "../pages/AppPages/FirstLogin";
import Dashboard from "../pages/AppPages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Transactions from "../pages/AppPages/Transactions";
import Goals from "../pages/AppPages/Goals";

import Reports from "../pages/AppPages/Reports";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="firstlogin" element={<FirstLogin />} />
        <Route element={<SetupGuard />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="goals" element={<Goals />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
