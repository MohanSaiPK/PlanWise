import React from "react";
// import { useState } from "react";

const Dashboard = () => {
  //const [monthlyIncome, setMonthlyIncome] = useState(null);

  return (
    <div className="text-center flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl">Dashboard</h1>
      <div className="w-full flex p-10 space-x-6 h-128 ">
        <div className="w-1/2 border-2 rounded-xl p-6 space-y-4">
          <h1>Your Score!</h1>
          <div className="w-full flex h-36 space-x-4">
            <div className="w-3/4 border-2  rounded-xl"></div>
            <div className="w-1/4 border-2  rounded-xl">picture</div>
          </div>
          <div className="flex h-36 space-x-4">
            <div className="border-2 w-1/3  rounded-xl">Savings Goal</div>
            <div className="border-2 w-1/3  rounded-xl">Spending Speed</div>
            <div className="border-2 w-1/3  rounded-xl">Recent Transaction</div>
          </div>
        </div>
        <div className="w-1/2 border-2 rounded-xl p-6 space-y-4">
          <h1 className="w-full">Financial Health Overview</h1>
          <div className="flex w-full h-64 space-x-6 ">
            <div className="w-1/2  border-2">Chart1 income vs expense</div>
            <div className="w-1/2  border-2">Sources Bar GRaph</div>
          </div>
          <div className="w-full border-2 h-16">
            <div>AI Tip</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
