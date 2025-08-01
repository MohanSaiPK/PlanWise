import "./App.css";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";

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