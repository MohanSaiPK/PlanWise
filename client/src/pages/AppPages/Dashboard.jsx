import React from "react";
import { useState, useEffect } from "react";
import { Pie, Tooltip, Cell, PieChart } from "recharts";

const Dashboard = () => {
  // const [monthlyIncome, setMonthlyIncome] = useState(null);
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
    setLoading(true);
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
  function getDaysSincePayday(payDay) {
    const today = new Date();
    const todayDay = today.getDate();
    let paydayDay =
      typeof payDay === "string" && payDay.length > 2
        ? new Date(payDay).getDate()
        : Number(payDay);

    if (isNaN(paydayDay)) return null;

    if (todayDay >= paydayDay) {
      return todayDay - paydayDay;
    } else {
      // Payday was last month
      const daysInLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      return todayDay + (daysInLastMonth - paydayDay);
    }
  }

  function getSpendingSpeed(payDay, totalIncome, totalExpenses) {
    if (!payDay || !totalIncome || !totalExpenses) return "N/A";

    const daysSincePayday = getDaysSincePayday(payDay);
    const ratio =
      totalIncome && totalExpenses ? totalExpenses / totalIncome : 0;

    // Example logic (tweak as you wish):
    if (ratio > 0.9) return "Danger: High Speed";
    if (daysSincePayday < 15 && ratio > 0.7) return "Danger: High Speed";

    // Medium: spent >70% but not in first half, or spent >50% in first half
    if (ratio > 0.7) return "Medium Speed";
    if (daysSincePayday < 15 && ratio > 0.5) return "Medium Speed";

    // Good: spent <=50% in first half, or <=70% in second half
    if (ratio <= 0.5 && daysSincePayday < 15) return "Good Speed";
    if (ratio <= 0.7 && daysSincePayday >= 15) return "Good Speed";
    return "Monitor Spending";
  }

  useEffect(() => {
    fetchBaseIncome();
    fetchMonthlyIncomeExpense();
    fetchRecentTransaction();
    fetchProfile();
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
          <div className="flex h-36 space-x-4">
            <div className="border-2 w-1/3  rounded-xl">Savings Goal</div>
            <div className="border-2 w-1/3  rounded-xl">
              Spending Speed:
              {getSpendingSpeed(payDay, totalIncome, totalExpenses)}
              <br />
              payDay: {payDay}
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
