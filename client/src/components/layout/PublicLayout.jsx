import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader";
import PublicFooter from "./Header/PublicFooter";
import ScrollToTop from "../ScrollToTop";

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
