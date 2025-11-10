import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logo } from "../../../assets/data/images.json";

const PublicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  return (
    <nav className="w-full h-20 flex items-center justify-between px-6 border-b border-divider bg-background/70 backdrop-blur-lg fixed top-0 left-0 right-0 z-40">
      {/* Left: Brand */}
      <div className="flex items-center gap-2" onClick={() => navigate("/")}>
        <img
          src={logo[0].source}
          alt="PlanWise"
          className="w-16 h-12 cursor-pointer"
        />
        <p className="font-bold text-inherit cursor-pointer">PlanWise</p>
      </div>

      {/* Center: Navigation Links */}
      {!isLoginPage && !isRegisterPage && (
        <div className="hidden sm:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-foreground font-semibold hover:text-primary transition-colors"
            aria-current="page"
          >
            Customers
          </a>
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Integrations
          </a>
        </div>
      )}
      {/* Right: Auth Buttons */}
      {!isLoginPage && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default PublicHeader;
