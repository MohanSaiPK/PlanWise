import React from "react";
//import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";
const MainNavbar = () => {
  //const navigate = useNavigate();
  return (
    <div className="flex   items-center justify-between   border-b-2 p-6 shadow-2xl top-0 left-0 right-0 bg-gray-300 fixed z-50">
      <div className="flex  items-center gap-2">
        <DollarSign />
        <h1 className="text-2xl font-bold">Finance Tracker</h1>
      </div>
      <div className="flex  items-center gap-4 ">
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer ">
          Search
        </a>
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer  ">
          Notifications
        </a>
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer  ">
          Settings
        </a>
        <a href="#" className="hover:text-black text-gray-600 cursor-pointer  ">
          Logout
        </a>
      </div>
    </div>
  );
};

export default MainNavbar;
