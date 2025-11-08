import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import SettingsModal from "../../Settings/SettingsModal";
import imagesData from "../../../assets/data/images.json";

const MainNavbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full h-20 flex items-center justify-between px-6 border-b border-divider bg-background/70 backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
      {/* Left: Brand */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-6 w-6" />
        <h1 className="text-xl font-bold text-foreground">PlanWise</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button
          className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-foreground" />
          {/* Optional: Add notification badge */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>

        {/* Profile Image with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Profile menu"
          >
            <img
              src={imagesData.profile[0].source}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <ChevronDown
              size={16}
              className={`text-foreground transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-xl border border-divider py-2 z-50">
              <button
                onClick={handleSettings}
                className="w-full px-4 py-2 text-left text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
              >
                <Settings size={18} className="text-foreground/70" />
                <span>Settings</span>
              </button>
              <div className="border-t border-divider my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </nav>
  );
};

export default MainNavbar;
