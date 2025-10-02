import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MainSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      key: "dashboard",
      label: "DashBoard",
      icon: "🏠",
      path: "/app/dashboard",
    },
    {
      key: "transactions",
      label: "Transactions",
      icon: "📝",
      path: "/app/transactions",
    },
    { key: "goals", label: "Goals", icon: "🚪", path: "/app/goals" },

    { key: "reports", label: "Reports", icon: "📊", path: "/app/reports" },
  ];

  const [selected, setSelected] = useState(
    menuItems.find((item) => location.pathname.startsWith(item.path))?.key ||
      "dashboard"
  );

  const handleNavigation = (item) => {
    setSelected(item.key);
    navigate(item.path);
  };

  return (
    <div className="flex flex-col border-r-2 p-4 space-y-10 w-64 items-center fixed left-0 min-h-screen mt-20">
      {menuItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleNavigation(item)}
          className={`border-1 p-4 w-56 rounded-xl cursor-pointer hover:-translate-y-1 transition duration-300 
            ${selected === item.key ? "bg-blue-100 font-bold shadow-md" : ""}`}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default MainSidebar;
