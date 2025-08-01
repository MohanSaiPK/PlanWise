import "./App.css";

import PublicRoutes from "./routes/PublicRoutes";
import AppRoutes from "./routes/AppRoutes";
import { Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <PublicRoutes />
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
