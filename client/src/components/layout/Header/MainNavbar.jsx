import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import SettingsModal from "../../Settings/SettingsModal";

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
    <div className="flex items-center justify-between border-b-2 p-6 shadow-2xl top-0 left-0 right-0 bg-gray-300 fixed z-50">
      <div className="flex items-center gap-2">
        <DollarSign />
        <h1 className="text-2xl font-bold">Finance Tracker</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button
          className="relative p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-600" />
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md border-2 border-white">
              {/* Placeholder for user image - replace with actual image later */}
              <span className="text-sm">U</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-600 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={handleSettings}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
              >
                <Settings size={18} className="text-gray-500" />
                <span>Settings</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
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
    </div>
  );
};

export default MainNavbar;
