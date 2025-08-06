import React from "react";
import { useState, useEffect } from "react";
import { Pie, Tooltip, Cell, PieChart } from "recharts";

const Dashboard = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [jobIncome, setJobIncome] = useState(null);
  const [investmentIncome, setInvestmentIncome] = useState(null);
  const [sideIncome, setSideIncome] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/income", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMonthlyIncome(data.income.monthlyIncome);
          setJobIncome(data.income.jobIncome);
          setInvestmentIncome(data.income.investmentIncome);
          setSideIncome(data.income.sideIncome);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const incomeData = [
    {
      name: "Job Income",
      value: jobIncome,
    },
    {
      name: "Investment Income",
      value: investmentIncome,
    },
    {
      name: "Side Income",
      value: sideIncome,
    },
  ];
  return (
    <div className="text-center flex flex-col justify-center items-center w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="text-4xl">Dashboard</h1>
        <div className="border-2 rounded-xl w-64 h-20">
          <h1>
            Monthly Income:{" "}
            {monthlyIncome !== null ? `$ ${monthlyIncome}` : "-Loading"}
          </h1>
          <h1>Remaining:</h1>
        </div>
      </div>
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
            <div className="w-1/2  border-2">
              <h1>Income Source Distribution</h1>
              <PieChart width={300} height={300} className="p-6 flex">
                <Pie
                  data={incomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="40%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {incomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#22c55e", "#f59e0b", "#3b82f6"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
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
