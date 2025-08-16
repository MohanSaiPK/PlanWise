import React from "react";
import { useState, useEffect } from "react";
import {
  Pie,
  Tooltip,
  Cell,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GaugeComponent } from "react-gauge-component";

const Dashboard = () => {
  const [jobIncome, setJobIncome] = useState(null);
  const [investmentIncome, setInvestmentIncome] = useState(null);
  const [sideIncome, setSideIncome] = useState(null);
  const [baseIncome, setBaseIncome] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [additionalIncome, setAdditionalIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payDay, setPayDay] = useState(null);

  const fetchBaseIncome = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/user-base-income",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setJobIncome(data.income.jobIncome);
        setInvestmentIncome(data.income.investmentIncome);
        setSideIncome(data.income.sideIncome);
      } else {
        console.error(
          "Error fetching base income:",
          data.message || data.error
        );
      }
    } catch (error) {
      console.error("Error fetching base income:", error);
    }
  };

  const fetchMonthlyIncomeExpense = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/income-expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBaseIncome(data.baseIncome);
        setTotalIncome(data.totalIncome);
        setAdditionalIncome(data.additionalIncome);
        setTotalExpenses(data.totalExpenses);
      } else {
        console.error(
          "Error fetching monthly income/expense:",
          data.message || data.error
        );
      }
    } catch (error) {
      console.error("Error fetching monthly income/expense:", error);
    }
  };
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      setPayDay(data.user.payday);
      console.log("Pay Day:", data.user.payday);
    }
  };

  const fetchRecentTransaction = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        // Handle the recent transactions data
        setRecentTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  function getDaysInPayCycle(payDayDate) {
    // Gets the year and month of the payday, then finds the last day of that month.
    return new Date(
      payDayDate.getFullYear(),
      payDayDate.getMonth() + 1,
      0
    ).getDate();
  }

  function getDaysSincePayday(payDayDate) {
    const today = new Date();
    // Set time to 0 to compare dates only, preventing partial day issues.
    today.setHours(0, 0, 0, 0);
    payDayDate.setHours(0, 0, 0, 0);

    // Difference in milliseconds converted to days
    const diffTime = Math.abs(today - payDayDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function getSpendingSpeed(payDayString, totalIncome, totalExpenses) {
    // Check for invalid or missing inputs
    if (
      !payDayString ||
      !totalIncome ||
      totalExpenses === null ||
      totalExpenses < 0
    ) {
      return 0;
    }

    const payDayDate = new Date(payDayString);
    if (isNaN(payDayDate.getTime())) return "Invalid Date";

    const daysSincePayday = getDaysSincePayday(payDayDate);
    const daysInCycle = getDaysInPayCycle(payDayDate);

    // If it's past the cycle, this logic doesn't apply.
    if (daysSincePayday > daysInCycle) return "Cycle Over";

    const daysRemaining = daysInCycle - daysSincePayday;
    // Calculate percentage of the cycle remaining
    const percentCycleRemaining = (daysRemaining / daysInCycle) * 100;

    const budgetRemaining = totalIncome - totalExpenses;
    // Calculate percentage of the budget remaining
    const percentBudgetRemaining = (budgetRemaining / totalIncome) * 100;

    // This is the core metric: the "buffer" between your money and time.
    const buffer = percentBudgetRemaining - percentCycleRemaining;

    // You can tweak these thresholds for the gauge chart.
    if (buffer < -15) {
      return 90; // You have significantly less money % than time % left.
    } else if (buffer < -10) {
      return 80; // You have less money % than time % left.
    } else if (buffer < -5) {
      return 70; // You have less money % than time % left.
    } else if (buffer < 0) {
      return 60; // You're on track, but with little to no buffer.
    } else if (buffer < 5) {
      return 50; // You're on track, but with little to no buffer.
    } else if (buffer < 10) {
      return 40; // You're on track, but with a small buffer.
    } else if (buffer < 15) {
      return 30; // You're on track, but with a moderate buffer.
    } else if (buffer < 20) {
      return 20; // You're on track, but with a moderate buffer.
    } else if (buffer < 25) {
      return 10; // You're on track, but with a good buffer.
    } else if (buffer >= 25) {
      return 0; // You're in a great position!
    }
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchBaseIncome(),
      fetchMonthlyIncomeExpense(),
      fetchRecentTransaction(),
      fetchProfile(),
    ]).finally(() => setLoading(false));
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

  const totalData = [
    {
      name:
        new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }) + " Total",
      exp: totalExpenses,
      rem: totalIncome - totalExpenses,
    },
  ];

  const top3Transactions = recentTransactions.slice(0, 3);

  return (
    <div className="text-center flex flex-col justify-center items-center w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="text-4xl">Dashboard</h1>
        <div className="border-2 rounded-xl w-64 h-20">
          <h1>
            Base Income:{" "}
            {baseIncome !== null && !loading ? `$ ${baseIncome}` : "-Loading"}
          </h1>
          <h1>
            Additional Income:{" "}
            {additionalIncome !== null && !loading
              ? `$ ${additionalIncome}`
              : "-Loading"}
          </h1>
          <h1>
            Total Income:{" "}
            {totalIncome !== null && !loading ? `$ ${totalIncome}` : "-Loading"}
          </h1>
          <h1>
            Total Expenses:{" "}
            {totalExpenses !== null && !loading
              ? `$ ${totalExpenses}`
              : "-Loading"}
          </h1>
          <h1>
            Remaining:{" "}
            {totalIncome !== null && totalExpenses !== null
              ? `$ ${totalIncome - totalExpenses}`
              : "-Loading"}
          </h1>
        </div>
      </div>
      <div className="w-full flex p-10 space-x-6 h-128 ">
        <div className="w-1/2 border-2 rounded-xl p-6 space-y-4">
          <h1>Your Score!</h1>
          <div className="w-full flex h-36 space-x-4">
            <div className="w-3/4 border-2  rounded-xl"></div>
            <div className="w-1/4 border-2  rounded-xl">picture</div>
          </div>
          <div className="flex h-46 space-x-4">
            <div className="border-2 w-1/3  rounded-xl">Savings Goal</div>
            <div className="border-2 w-1/3 rounded-xl flex flex-col  ">
              <p className="text-center font-medium ">Spending Speed:</p>
              <div className="flex-1 w-full relative">
                <GaugeComponent
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                  type="radial"
                  arc={{
                    colorArray: ["#00FF15", "#FF2121"],
                    padding: 0.03,
                    subArcs: [
                      { limit: 40 },
                      { limit: 60 },
                      { limit: 70 },
                      { limit: 80 },
                      { limit: 90 },
                      { limit: 100 },
                    ],
                  }}
                  labels={{
                    valueLabel: {
                      matchColorWithArc: true,
                    },
                    tickLabels: {
                      hideMinMax: true,
                    },
                  }}
                  pointer={{ type: "needle", animationDelay: 1000 }}
                  value={getSpendingSpeed(payDay, totalIncome, totalExpenses)}
                />
              </div>
            </div>
            <div className="border-2 w-1/3  rounded-xl">
              <p>Recent Transactions</p>
              <ul>
                {top3Transactions.map((txn) => (
                  <li key={txn._id}>
                    {txn.description}: {txn.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-1/2 border-2 rounded-xl p-6 space-y-4">
          <h1 className="w-full">Financial Health Overview</h1>
          <div className="flex w-full h-64 space-x-6 ">
            <div className="w-1/2  border-2">
              <p>Chart1 income vs expense</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={100}
                  height={300}
                  data={totalData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="exp" stackId="a" fill="#8884d8" />
                  <Bar dataKey="rem" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
