import React from "react";
import { DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PublicHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex  items-center justify-between   border-b-2 p-6 shadow-2xl top-0 left-0 right-0 bg-gray-300 fixed z-50">
      <div className="flex items-center gap-2">
        <DollarSign />
        <h1 className="text-2xl font-bold">Finance Tracker</h1>
      </div>
      <div className="flex items-center gap-4 ">
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer ">
          Features
        </a>
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer  ">
          Pricing
        </a>
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer  ">
          About
        </a>
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer  ">
          Contact
        </a>
        {window.location.pathname !== "/login" && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default PublicHeader;
