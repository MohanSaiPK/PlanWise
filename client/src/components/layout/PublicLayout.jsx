import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader";
import PublicFooter from "./Header/PublicFooter";

const PublicLayout = () => {
  return (
    <>
      <PublicHeader />

      <main className="container flex-grow min-h-screen mt-10">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
};

export default PublicLayout;
