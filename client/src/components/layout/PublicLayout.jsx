import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader";
import PublicFooter from "./Header/PublicFooter";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="container flex-grow min-h-screen ">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
