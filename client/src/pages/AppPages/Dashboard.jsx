import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Pie,
  Cell,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BiSolidDashboard } from "react-icons/bi";
import { GaugeComponent } from "react-gauge-component";
import { modes } from "../../assets/data/images.json";
import IncomeCards from "../../components/cards/IncomeCards";
import { useIncome } from "../../hooks/useIncome";

const Dashboard = () => {
  const { incomeData, loading, totalIncome, totalExpenses } = useIncome();
  const [jobIncome, setJobIncome] = useState(null);
  const [investmentIncome, setInvestmentIncome] = useState(null);
  const [sideIncome, setSideIncome] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [payDay, setPayDay] = useState(null);
  const [goals, setGoals] = useState([]);

  // -------- DATA FETCHING --------
  useEffect(() => {
    const loadDashBoard = async () => {
      try {
        await Promise.all([
          fetchBaseIncome(),
          fetchRecentTransaction(),
          fetchProfile(),
          fetchGoals(),
        ]);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
    loadDashBoard();
  }, []);

  const fetchBaseIncome = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/user-base-income",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setJobIncome(data.income.jobIncome);
        setInvestmentIncome(data.income.investmentIncome);
        setSideIncome(data.income.sideIncome);
      }
    } catch (err) {
      console.error("Error fetching base income:", err);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPayDay(data.user.payday);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchRecentTransaction = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecentTransactions(data.transactions);
    } catch (err) {
      console.error("Error fetching recent transactions:", err);
    }
  };

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch goals");
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  // -------- GOAL LOGIC --------

  const nearestGoal = useMemo(() => {
    if (!goals?.length) return null;
    const activeGoals = goals.filter((g) => g.status === "Active");
    if (!activeGoals.length) return null;
    return activeGoals.reduce((nearest, current) =>
      new Date(current.endDate) < new Date(nearest.endDate) ? current : nearest
    );
  }, [goals]);

  const goalProgress = useMemo(() => {
    if (!nearestGoal || nearestGoal.targetAmount <= 0) return null;
    return (nearestGoal.savedAmount / nearestGoal.targetAmount) * 100;
  }, [nearestGoal]);

  //---------Spending Speed Logic (vs time in pay cycle)---------

  //safeNumber utility
  const safeNumber = (num, fallback = 0) =>
    Number.isFinite(num) ? num : fallback;

  //Main Logic
  const spendingSpeedScore = useMemo(() => {
    const income = safeNumber(totalIncome, 0);
    const expenses = safeNumber(totalExpenses, 0);

    if (!payDay || income <= 0) return 50; // neutral if unknown

    const daysSincePayday = getDaysSincePayday(payDay);
    const payDayDate = new Date(payDay);
    const daysInCycle = getDaysInPayCycle(payDayDate);

    const percentCycleElapsed =
      (daysSincePayday / Math.max(daysInCycle, 1)) * 100;
    const percentBudgetSpent = (expenses / Math.max(income, 1)) * 100;

    const t = Math.max(0, Math.min(1, percentCycleElapsed / 100));
    const s = Math.max(0, Math.min(1, percentBudgetSpent / 100));

    // If no expenses yet, treat pacing safety as max so gauge shows 0
    if (expenses === 0) return 100;

    const overshoot = Math.max(0, s - t);
    const undershoot = Math.max(0, t - s);

    // Normalize: perfect pacing ~70, cap max ~90
    let score = 70 - Math.min(70, (overshoot / 0.3) * 70);
    score += Math.min(20, (undershoot / 0.3) * 20);

    // End-of-cycle adjustments
    if (t >= 0.95) {
      if (s >= 0.6 && s <= 0.75) score += 5; // sweet spot
      if (s < 0.5) score -= 10; // underutilized budget may indicate misreporting
    }

    return Math.round(Math.max(0, Math.min(100, score)));

    function getDaysSincePayday(payDayInput) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Always derive using numeric day-of-month only
      let dayOfMonth = Number(payDayInput);
      if (!Number.isFinite(dayOfMonth)) {
        const d = new Date(payDayInput);
        dayOfMonth = Number.isFinite(d.getTime()) ? d.getDate() : NaN;
      }
      if (!Number.isFinite(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31)
        return 0;

      let pd = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
      pd.setHours(0, 0, 0, 0);
      if (pd > today) pd.setMonth(pd.getMonth() - 1);

      return Math.floor((today - pd) / (1000 * 60 * 60 * 24));
    }

    function getDaysInPayCycle(payDayDate) {
      return new Date(
        payDayDate.getFullYear(),
        payDayDate.getMonth() + 1,
        0
      ).getDate();
    }
  }, [payDay, totalIncome, totalExpenses]);

  // Income-Expense Ratio (score form 0-100)
  const incomeExpenseScore = useMemo(() => {
    const income = safeNumber(totalIncome, 0);
    const expenses = safeNumber(totalExpenses, 0);
    if (income <= 0) return 50; // neutral
    const s = Math.max(0, Math.min(1, expenses / income));
    return Math.round((1 - s) * 100);
  }, [totalIncome, totalExpenses]);

  // -------- SCORE CALCULATION --------

  const score = useMemo(() => {
    const weights = { goal: 0.6, spending: 0.05, ratio: 0.35 };
    let total = 0;
    let denom = 0;

    if (Number.isFinite(goalProgress)) {
      const gp = Math.max(0, Math.min(100, goalProgress));
      total += gp * weights.goal;
      denom += weights.goal;
    }

    if (Number.isFinite(spendingSpeedScore)) {
      const ss = Math.max(0, Math.min(100, spendingSpeedScore));
      total += ss * weights.spending;
      denom += weights.spending;
    }

    if (Number.isFinite(incomeExpenseScore)) {
      const ier = Math.max(0, Math.min(100, incomeExpenseScore));
      total += ier * weights.ratio;
      denom += weights.ratio;
    }

    if (denom === 0) return 0;
    return Math.round(total / denom);
  }, [goalProgress, spendingSpeedScore, incomeExpenseScore]);

  const { grade, color, label } = useMemo(() => {
    if (score >= 80)
      return { grade: "A", color: "text-green-600", label: "Excellent" };
    if (score >= 60)
      return { grade: "B", color: "text-yellow-500", label: "Good" };
    if (score >= 40)
      return { grade: "C", color: "text-orange-500", label: "Needs Attention" };
    return { grade: "D", color: "text-red-600", label: "Poor" };
  }, [score]);

  const getMascot = useCallback((score) => {
    if (score >= 80) return modes.find((m) => m.type === "excellent")?.source;
    if (score >= 60) return modes.find((m) => m.type === "good")?.source;
    if (score >= 40) return modes.find((m) => m.type === "average")?.source;
    return modes.find((m) => m.type === "poor")?.source;
  }, []);

  //------Base Income Data for distribution chart------
  const baseIncomeData = useMemo(
    () => [
      { name: "Job Income", value: jobIncome },
      { name: "Investment Income", value: investmentIncome },
      { name: "Side Income", value: sideIncome },
    ],
    [jobIncome, investmentIncome, sideIncome]
  );

  //------Total Income vs Expense Chart Data------
  const totalData = useMemo(
    () => [
      {
        name:
          new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }) + " Total",
        exp: totalExpenses ?? 0,
        rem: (totalIncome ?? 0) - (totalExpenses ?? 0),
      },
    ],
    [totalIncome, totalExpenses]
  );

  const top3Transactions = useMemo(
    () => recentTransactions.slice(0, 3),
    [recentTransactions]
  );

  return (
    <div className="text-center flex flex-col justify-center items-center w-full">
      <div className="flex flex-row items-center justify-center gap-4  w-full m-4 p-2">
        <div className="flex items-center justify-center w-1/10 h-full border-2 rounded-xl p-2">
          <BiSolidDashboard className="w-full h-full" />
        </div>
        <div className="flex flex-1 items-start justify-center">
          <IncomeCards data={incomeData} loading={loading} />
        </div>
      </div>
      {/* COL 1 */}
      <div className="w-full flex px  -10 space-x-6  ">
        <div className="w-1/2 border-2 rounded-xl p-6 space-y-4">
          <h1>Your Score!</h1>
          <div className="w-full flex h-36 space-x-4">
            <div className=" w-2/3 border-2 rounded-xl p-6 flex flex-col items-center justify-center   shadow-md">
              <h2 className="text-lg font-semibold">Financial Score</h2>
              <h1 className={`text-5xl font-bold ${color}`}>{score}</h1>
              <p className={`text-xl font-medium ${color}`}>{grade}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>

            <div className="w-1/3 border-2 rounded-xl">
              <img
                src={getMascot(score)}
                alt="Financial mascot"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="flex h-46 space-x-4">
            <div className="border-2 w-1/3  rounded-xl">
              <p>{nearestGoal ? nearestGoal.name : "No Active Goal"}</p>
            </div>
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
                      { limit: 20 },
                      { limit: 40 },
                      { limit: 60 },
                      { limit: 80 },
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
                  value={
                    typeof spendingSpeedScore === "number"
                      ? Math.max(0, Math.min(100, 100 - spendingSpeedScore))
                      : 0
                  }
                />
              </div>
            </div>
            <div className="border-2 w-1/3  rounded-xl">
              <p>Recent Transactions</p>
              <ul>
                {top3Transactions.map((txn) => (
                  <li key={txn._id}>
                    {txn.description == "Added to Goals Wallet"
                      ? "+ Goals Wallet"
                      : txn.description}
                    : {txn.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* COL 2 */}
        <div className="w-1/2 border-2 rounded-xl p-6 space-y-4">
          <h1 className="w-full">Financial Health Overview</h1>
          <div className="flex w-full h-64 space-x-6 ">
            <div className="w-1/2 border-2 flex flex-col items-center justify-center">
              <p className="text-center mb-2">Chart1 income vs expense</p>
              <div className="flex items-center justify-center w-full h-full">
                {!loading && totalData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={totalData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 30,
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
                )}
              </div>
            </div>
            <div className="w-1/2  border-2">
              <h1>Income Source Distribution</h1>
              <PieChart width={300} height={300} className="p-6 flex">
                <Pie
                  data={baseIncomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="40%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {baseIncomeData.map((entry, index) => (
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
