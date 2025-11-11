import "./App.css";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/app/*" element={<AppRoutes />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
