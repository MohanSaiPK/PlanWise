import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader.jsx";
import PublicFooter from "./Header/PublicFooter.jsx";
import ScrollToTop from "../ScrollControl/ScrollToTop.jsx";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PublicHeader />

      <main className="container flex-grow min-h-screen ">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
