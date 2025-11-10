import "./App.css";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { IncomeProvider } from "./context/IncomeContext.jsx";
function App() {
  return (
    <AuthProvider>
      <IncomeProvider>
        <Routes>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/app/*" element={<AppRoutes />} />
        </Routes>
      </IncomeProvider>
    </AuthProvider>
  );
}

export default App;
