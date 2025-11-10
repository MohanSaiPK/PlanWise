import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import SetupGuard from "./SetupGuard.jsx";
import FirstLogin from "../pages/AppPages/FirstLogin.jsx";
import Dashboard from "../pages/AppPages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Transactions from "../pages/AppPages/Transactions.jsx";
import Goals from "../pages/AppPages/Goals.jsx";
import Reports from "../pages/AppPages/Reports.jsx";
import { IncomeProvider } from "../context/IncomeContext.jsx";

const AppRoutes = () => {
  return (
    <IncomeProvider>
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
    </IncomeProvider>
  );
};

export default AppRoutes;
