import React from "react";

import { Outlet } from "react-router-dom";
import MainNavbar from "./Header/MainNavbar";
import MainSidebar from "./Sidebar/MainSidebar";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";

const MainLayout = () => {
  return (
    <>
      <MainNavbar />
      <MainSidebar />
      <main className=" h-screen  overflow-y-auto overflow-x-hidden pl-64 pt-20">
        <Outlet />
      </main>
      <FloatingActionButton />
    </>
  );
};

export default MainLayout;
