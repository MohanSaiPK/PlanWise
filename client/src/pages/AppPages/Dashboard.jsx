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
import {
  LayoutDashboard,
  Goal,
  Receipt,
  Drama,
  TrainFront,
  Hamburger,
  Shapes,
  Gift,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { GaugeComponent } from "react-gauge-component";
import { modes } from "../../assets/data/images.json";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IncomeCards from "../../components/cards/IncomeCards";
import { useIncome } from "../../hooks/useIncome";

const Dashboard = () => {
  const { incomeData, loading, totalIncome, totalExpenses, resetIncomes } =
    useIncome();
  const [jobIncome, setJobIncome] = useState(null);
  const [investmentIncome, setInvestmentIncome] = useState(null);
  const [sideIncome, setSideIncome] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [payDay, setPayDay] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Track mobile state with debounce
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // -------- DATA FETCHING --------
  useEffect(() => {
    const loadDashBoard = async () => {
      try {
        // Refresh income data to ensure spending speed uses latest total income
        await resetIncomes();
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
  }, [resetIncomes]);

  // Refresh income data when page becomes visible (to catch updates from other tabs/pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetIncomes();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetIncomes]);

  // Refresh data when transaction is added from FAB
  useEffect(() => {
    const handleTransactionAdded = () => {
      resetIncomes();
      fetchRecentTransaction();
    };

    window.addEventListener("transactionAdded", handleTransactionAdded);

    return () => {
      window.removeEventListener("transactionAdded", handleTransactionAdded);
    };
  }, [resetIncomes]);

  // Refresh data when settings are updated
  useEffect(() => {
    const handleSettingsUpdated = () => {
      resetIncomes();
      fetchBaseIncome();
      fetchProfile();
    };

    window.addEventListener("settingsUpdated", handleSettingsUpdated);

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdated);
    };
  }, [resetIncomes]);

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
    if (!nearestGoal) return null;
    // Prefer allocated/amount (as used in Goals), fallback to savedAmount/targetAmount
    const allocated = Number(
      nearestGoal.allocated ?? nearestGoal.savedAmount ?? 0
    );
    const target = Number(nearestGoal.amount ?? nearestGoal.targetAmount ?? 0);
    if (!Number.isFinite(target) || target <= 0) return null;
    return (allocated / target) * 100;
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
    const weights = { goal: 0.25, spending: 0.35, ratio: 0.4 };
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

  // Get icon for expense category
  const getExpenseIcon = (category) => {
    const iconProps = { size: 18, className: "text-red-500 flex-shrink-0" };
    switch (category) {
      case "Goal":
        return (
          <Goal {...iconProps} className="text-yellow-500 flex-shrink-0" />
        );
      case "Bills":
        return (
          <Receipt {...iconProps} className="text-zinc-500 flex-shrink-0" />
        );
      case "Entertainment":
        return <Drama {...iconProps} className="text-blue-500 flex-shrink-0" />;
      case "Transport":
        return (
          <TrainFront
            {...iconProps}
            className="text-emerald-500 flex-shrink-0"
          />
        );
      case "Food":
        return (
          <Hamburger {...iconProps} className="text-amber-500 flex-shrink-0" />
        );
      default:
        return (
          <Shapes {...iconProps} className="text-gray-500 flex-shrink-0" />
        );
    }
  };

  // Get icon for income category
  const getIncomeIcon = (category) => {
    const iconProps = { size: 18, className: "text-green-500 flex-shrink-0" };
    switch (category) {
      case "Bonus":
        return <Gift {...iconProps} className="text-pink-500 flex-shrink-0" />;
      case "Business":
        return (
          <Briefcase {...iconProps} className="text-lime-500 flex-shrink-0" />
        );
      case "Investments":
        return (
          <TrendingUp {...iconProps} className="text-teal-500 flex-shrink-0" />
        );
      default:
        return (
          <Shapes {...iconProps} className="text-gray-500 flex-shrink-0" />
        );
    }
  };

  return (
    <div className="flex flex-col w-full px-2 md:px-4 lg:px-6 py-4 md:py-6">
      {/* Header with Income Cards - Hide icon on mobile */}
      <h1 className="text-2xl md:text-3xl mb-4  font-semibold">Dashboard</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 w-full mb-4 md:mb-6">
        <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-xl p-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow flex-shrink-0">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div className="flex flex-1 items-start justify-center w-full">
          <IncomeCards data={incomeData} loading={loading} />
        </div>
      </div>

      {/* Main Content - Stack on mobile, side-by-side on desktop */}
      <div className="w-full flex flex-col items-between lg:flex-row gap-4 md:gap-6">
        {/* COL 1 - Score Section */}
        <div className="w-full lg:w-1/2 border-2 rounded-xl p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 hidden md:block">
            Your Score!
          </h1>
          <div className="w-full flex  sm:flex-row gap-3 md:gap-4">
            <div className="w-full sm:w-2/3 border-2 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center shadow-md">
              <h2 className="text-sm md:text-base font-semibold text-gray-700">
                Financial Score
              </h2>
              <h1 className={`text-4xl md:text-5xl font-bold ${color}`}>
                {score}
              </h1>
              <p className={`text-lg md:text-xl font-semibold ${color}`}>
                {grade}
              </p>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                {label}
              </p>
            </div>

            <div className="w-full sm:w-1/3 border-2 rounded-xl min-h-[150px] md:min-h-[200px]">
              <img
                src={getMascot(score)}
                alt="Financial mascot"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {/* Mobile: First row with Goal and Spending Speed */}
            <div className="flex flex-row gap-2 md:hidden">
              <div className="border-2 w-1/2 rounded-xl p-3 flex flex-col justify-between">
                {nearestGoal ? (
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-xs text-gray-900 flex-1 truncate">
                        {nearestGoal.name}
                      </h3>
                      {nearestGoal.priority && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white whitespace-nowrap font-medium flex-shrink-0">
                          {nearestGoal.priority}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {new Date(nearestGoal.startDate).toLocaleDateString()} →{" "}
                      {new Date(nearestGoal.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 md:gap-1 justify-between md:justify-center w-full flex-1">
                      <div className="flex gap-1 md:gap-2 flex-1">
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-xs text-gray-500 font-medium">
                            Target
                          </span>
                          <span className="font-semibold text-xs text-gray-700 truncate w-full">
                            ₹{nearestGoal.amount ?? nearestGoal.targetAmount}
                          </span>
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-xs text-gray-500 font-medium">
                            Allocated
                          </span>
                          <span className="font-semibold text-xs text-gray-700 truncate w-full">
                            ₹
                            {nearestGoal.allocated ??
                              nearestGoal.savedAmount ??
                              0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mx-auto self-end md:self-center">
                        <div className="flex items-center justify-center w-12 h-12">
                          <CircularProgressbar
                            value={Math.max(
                              0,
                              Math.min(100, Math.round(goalProgress ?? 0))
                            )}
                            text={`${Math.max(
                              0,
                              Math.min(100, Math.round(goalProgress ?? 0))
                            )}%`}
                            styles={buildStyles({
                              pathColor: "#22c55e",
                              textColor: "#065f46",
                              trailColor: "#e5e7eb",
                              strokeLinecap: "round",
                              textSize: "8px",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center font-medium flex items-center justify-center h-full">
                    No Active Goal
                  </p>
                )}
              </div>
              <div className="border-2 w-1/2 rounded-xl flex flex-col justify-center items-center p-2">
                <p className="text-center font-semibold text-xs text-gray-700 mb-2">
                  Spending Speed
                </p>
                <div className="w-full relative aspect-square max-h-32 mx-auto flex items-center justify-center">
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
                        style: {
                          fontSize: 24,
                          fontWeight: "bold",
                          textShadow: "none",
                        },
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
            </div>

            <div className="hidden md:flex md:flex-row md:h-64 md:gap-4  w-full">
              <div className="border-2 w-1/3 rounded-xl p-4 flex flex-col md:justify-between justify-between items-center h-full">
                {nearestGoal ? (
                  <div className="flex flex-col gap-2 md:gap-3 h-full">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm lg:text-base text-gray-900 flex-1">
                        {nearestGoal.name}
                      </h3>
                      {nearestGoal.priority && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white whitespace-nowrap font-medium">
                          {nearestGoal.priority}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {new Date(nearestGoal.startDate).toLocaleDateString()} →{" "}
                      {new Date(nearestGoal.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex flex-col gap-1 md:gap-2 flex-1 justify-between md:justify-start">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-xs text-gray-500 font-medium">
                            Target
                          </span>
                          <span className="font-semibold text-base text-gray-700 truncate w-full">
                            ₹{nearestGoal.amount ?? nearestGoal.targetAmount}
                          </span>
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-xs text-gray-500 font-medium">
                            Allocated
                          </span>
                          <span className="font-semibold text-base text-gray-700 truncate w-full">
                            ₹
                            {nearestGoal.allocated ??
                              nearestGoal.savedAmount ??
                              0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-16 h-16">
                          <CircularProgressbar
                            value={Math.max(
                              0,
                              Math.min(100, Math.round(goalProgress ?? 0))
                            )}
                            text={`${Math.max(
                              0,
                              Math.min(100, Math.round(goalProgress ?? 0))
                            )}%`}
                            styles={buildStyles({
                              pathColor: "#22c55e",
                              textColor: "#065f46",
                              trailColor: "#e5e7eb",
                              strokeLinecap: "round",
                              textSize: "10px",
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-base text-gray-500 text-center font-medium flex items-center justify-center h-full">
                    No Active Goal
                  </p>
                )}
              </div>
              <div className="border-2 w-1/3 rounded-xl flex flex-col justify-center items-center p-3 h-full">
                <p className="text-center font-semibold text-base text-gray-700 mb-3">
                  Spending Speed
                </p>
                <div className="w-full relative aspect-square max-h-64 mx-auto flex items-center justify-center">
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
                        style: {
                          fontSize: 40,
                          fontWeight: "bold",
                          textShadow: "none",
                        },
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
              <div className="border-2 w-1/3 rounded-xl p-3 flex flex-col h-full">
                <h3 className="font-semibold text-sm mb-2 text-gray-700">
                  Recent Transactions
                </h3>
                <div className="flex flex-col gap-2 min-h-0 flex-1">
                  {top3Transactions.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2 font-medium">
                      No recent transactions
                    </p>
                  ) : (
                    top3Transactions.map((txn) => (
                      <div
                        key={txn._id}
                        className={`p-2 rounded-lg border ${
                          txn.type === "income"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                            <div className="text-sm flex items-center space-x-2 font-medium text-gray-900 truncate w-full">
                              {txn.type === "income"
                                ? getIncomeIcon(txn.category)
                                : getExpenseIcon(txn.category)}
                              <p className="truncate">
                                {txn.description === "Added to Goals Wallet"
                                  ? "+ Goals Wallet"
                                  : txn.description}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                              {new Date(txn.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`font-semibold text-sm whitespace-nowrap ${
                              txn.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {txn.type === "income" ? "+" : "-"}₹{txn.amount}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: Recent Transactions in separate row with horizontal scroll */}
            <div className="border-2 rounded-xl p-2 md:hidden flex flex-col">
              <h3 className="font-semibold text-xs mb-2 text-gray-700">
                Recent Transactions
              </h3>
              <div className="flex flex-row gap-2 overflow-x-auto pb-1 -mx-2 px-2">
                {top3Transactions.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-2 font-medium w-full">
                    No recent transactions
                  </p>
                ) : (
                  top3Transactions.map((txn) => (
                    <div
                      key={txn._id}
                      className={`p-2 rounded-lg border flex-shrink-0 w-[200px] ${
                        txn.type === "income"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center space-x-2 font-medium text-gray-900">
                          {txn.type === "income"
                            ? getIncomeIcon(txn.category)
                            : getExpenseIcon(txn.category)}
                          <p className="text-xs truncate flex-1">
                            {txn.description === "Added to Goals Wallet"
                              ? "+ Goals Wallet"
                              : txn.description}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(txn.date).toLocaleDateString()}
                        </p>
                        <span
                          className={`font-semibold text-xs whitespace-nowrap ${
                            txn.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.type === "income" ? "+" : "-"}₹{txn.amount}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* COL 2 - Financial Health Overview */}
        <div className="w-full lg:w-1/2 border-2 rounded-xl p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
          <h1 className="w-full text-lg md:text-xl font-bold text-gray-900">
            Financial Health Overview
          </h1>
          <div className="flex w-full md:flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="w-full lg:w-1/2 border-2 rounded-xl p-2 md:p-3 flex flex-col">
              <p className="text-center mb-2 text-sm md:text-base font-semibold text-gray-700">
                Income vs Expense
              </p>
              <div className="flex-1 min-h-[200px] md:min-h-[300px] lg:min-h-[350px] w-full">
                {!loading && totalData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={totalData}
                      margin={{
                        top: 20,
                        right: 10,
                        left: isMobile ? 0 : 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="name"
                        fontSize={isMobile ? 10 : 12}
                        tick={{ fill: "#6b7280" }}
                        axisLine={{ stroke: "#d1d5db" }}
                      />
                      <YAxis
                        width={isMobile ? 50 : 60}
                        fontSize={isMobile ? 10 : 12}
                        tick={{ fill: "#6b7280" }}
                        axisLine={{ stroke: "#d1d5db" }}
                        tickFormatter={(value) =>
                          `₹${
                            value >= 1000
                              ? (value / 1000).toFixed(1) + "k"
                              : value
                          }`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: isMobile ? "11px" : "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: isMobile ? "8px" : "12px",
                          textAlign: "center",
                          paddingTop: "5px",
                        }}
                        iconType="square"
                      />
                      <Bar
                        dataKey="exp"
                        stackId="a"
                        fill="#ef4444"
                        radius={[6, 6, 0, 0]}
                        name="Expenses"
                      />
                      <Bar
                        dataKey="rem"
                        stackId="a"
                        fill="#22c55e"
                        radius={[6, 6, 0, 0]}
                        name="Remaining"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-between lg:w-1/2 border-2 rounded-xl p-2 md:p-3">
              <h1 className="text-center text-sm md:text-base mb-2 font-semibold text-gray-700">
                Income Source Distribution
              </h1>
              <div className="w-full h-64 lg:h-[250px] py-2 md:py-3 ">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart className="w-full h-full flex">
                    <Pie
                      data={baseIncomeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="60%"
                      label={({ percent }) =>
                        percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                      }
                      labelLine={true}
                      labelStyle={{
                        fontSize: isMobile ? "10px" : "12px",
                        fontWeight: "500",
                        fill: "#374151",
                      }}
                    >
                      {baseIncomeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#22c55e", "#f59e0b", "#3b82f6"][index % 3]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      wrapperStyle={{ fontSize: isMobile ? "8px" : "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="w-full border-2 rounded-xl p-3 md:p-4 min-h-[50px] md:h-16 flex items-center justify-center">
            <div className="text-sm md:text-base font-semibold text-gray-700">
              AI Tip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
