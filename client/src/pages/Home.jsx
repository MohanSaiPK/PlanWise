import React from "react";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center  h-screen space-y-16 mt-14">
      <div className="flex flex-row items-center justify-center gap-2 border py-1 rounded-3xl px-4 mt-10">
        <Shield />
        <h1 className="text-sm font-bold">Trusted by 50,000+ investors</h1>
      </div>
      <h1 className="text-7xl font-bold w-1/2 text-center">
        Build Your Wealth Strategically
      </h1>

      <p className="text-lg">
        Track your finances and get a clear picture of your financial health.
      </p>
      <div className="flex gap-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Get Started
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/register")}
        >
          Signup
        </button>
      </div>

      <div className=" cards flex flex-row items-center justify-center gap-4">
        <div className="flex flex-col justify-center items-center border rounded-lg p-4">
          <h1 className="text-4xl">$2.5B +</h1>
          <p className="text-sm">Assets Under Management</p>
        </div>
        <div className="flex flex-col justify-center items-center border rounded-lg p-4">
          <h1 className="text-4xl">94%</h1>
          <p className="text-sm">Client Success Rate</p>
        </div>
        <div className="flex flex-col justify-center items-center border rounded-lg p-4">
          <h1 className="text-4xl">50K+</h1>
          <p className="text-sm">HappyClients Served</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
