import React from "react";
import { AcmeLogo } from "../../ui/AcmeLogo";
import { useNavigate } from "react-router-dom";

const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full h-20 flex items-center justify-between px-6 border-b border-divider bg-background/70 backdrop-blur-lg fixed top-0 left-0 right-0 z-40">
      {/* Left: Brand */}
      <div className="flex items-center gap-2">
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </div>

      {/* Center: Navigation Links */}
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

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default PublicHeader;
