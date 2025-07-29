import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader";
import PublicFooter from "./Header/PublicFooter";

const PublicLayout = () => {
  return (
    <>
      <PublicHeader />

      <main className="container mx-auto">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
};

export default PublicLayout;
