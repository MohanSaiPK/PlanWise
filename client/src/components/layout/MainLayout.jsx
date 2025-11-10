import React, { useState } from "react";

import { Outlet } from "react-router-dom";
import MainNavbar from "./Header/MainNavbar";
import MainSidebar from "./Sidebar/MainSidebar";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";
import { SidebarProvider } from "../ui/sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider
      open={sidebarOpen}
      setOpen={setSidebarOpen}
      animate={false}
    >
      <MainNavbar />
      <MainSidebar />
      <main
        className="h-screen overflow-y-auto overflow-x-hidden pl-0 md:pl-[300px] pt-20 transition-all duration-300"
        style={{ overflowAnchor: "none" }}
      >
        <Outlet />
      </main>
      <FloatingActionButton />
    </SidebarProvider>
  );
};

export default MainLayout;
