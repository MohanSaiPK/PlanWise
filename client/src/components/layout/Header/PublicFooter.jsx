import React from "react";

const PublicFooter = () => {
  return (
    <footer className="flex flex-row items-center justify-between space-x-4 bg-black text-white h-52 px-20 ">
      <div className="flex flex-col gap-2  w-1/4">
        <h1>Finance Tracker</h1>
        <p>
          Track your finances and get a clear picture of your financial health.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-1/4">
        <h1>Quick Links</h1>
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
      <div className="flex flex-col gap-2 w-1/4 ">
        <h1>Contact Us</h1>
        <p>123 Main St, Anytown, USA</p>
        <p>info@financetracker.com</p>
        <p>+1 (123) 456-7890</p>
      </div>
    </footer>
  );
};

export default PublicFooter;
