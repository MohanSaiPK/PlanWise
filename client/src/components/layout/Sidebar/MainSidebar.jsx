import React from "react";

const MainSidebar = () => {
  return (
    <div className="flex flex-col border-r-2 p-4 space-y-10 w-64 items-center fixed left-0 min-h-screen  ">
      <div className="border-1 p-4 w-48 rounded-xl hover:-translate-y-1 transition duration-300">
        DashBoard
      </div>
      <div className="border-1 p-4 w-48 rounded-xl hover:-translate-y-1 transition duration-300">
        Transactions
      </div>
      <div className="border-1 p-4 w-48 rounded-xl hover:-translate-y-1 transition duration-300">
        Goals
      </div>
      <div className="border-1 p-4 w-48 rounded-xl hover:-translate-y-1 transition duration-300">
        Budget Planner
      </div>
      <div className="border-1 p-4 w-48 rounded-xl hover:-translate-y-1 transition duration-300">
        Reports
      </div>
      <div className="border-1 p-4 w-48 rounded-xl hover:-translate-y-1 transition duration-300">
        Settings
      </div>
    </div>
  );
};

export default MainSidebar;
