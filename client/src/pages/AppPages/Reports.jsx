import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import {
  computeFinancialScore,
  computeIncomeExpenseScore,
  computeSpendingSpeedScore,
} from "../../lib/financeScore";

const monthLabel = (mIdx) =>
  new Date(new Date().getFullYear(), mIdx, 1).toLocaleDateString("en-US", {
    month: "long",
  });

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [baseIncome, setBaseIncome] = useState(0);
  const [payDay, setPayDay] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const [txRes, incomeRes, profileRes] = await Promise.all([
        fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/user/user-base-income", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const txData = await txRes.json();
      if (txData.success) setTransactions(txData.transactions || []);

      const incomeData = await incomeRes.json();
      if (incomeData.success) {
        const bi = incomeData.income;
        const sum =
          (bi?.jobIncome || 0) +
          (bi?.investmentIncome || 0) +
          (bi?.sideIncome || 0);
        setBaseIncome(sum);
      }

      const profileData = await profileRes.json();
      if (profileData.success) setPayDay(profileData.user?.payday ?? null);
    } catch (e) {
      console.error("Failed to load reports data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchAll();
    };
    window.addEventListener("visibilitychange", onVisibility);
    return () => window.removeEventListener("visibilitychange", onVisibility);
  }, [fetchAll]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-based

  const monthsUpToCurrent = useMemo(() => {
    const months = [];
    for (let m = 0; m <= currentMonth; m++) months.push(m);
    return months; // chronological for charts
  }, [currentMonth]);

  const monthGroups = useMemo(() => {
    const byMonth = new Map();
    for (const m of monthsUpToCurrent) byMonth.set(m, []);
    for (const t of transactions) {
      const d = new Date(t.date);
      if (d.getFullYear() !== currentYear) continue;
      const m = d.getMonth();
      if (m >= 0 && m <= currentMonth) {
        byMonth.get(m)?.push(t);
      }
    }
    return byMonth;
  }, [transactions, currentYear, currentMonth, monthsUpToCurrent]);

  const monthSummaries = useMemo(() => {
    const result = [];
    const paydayDom = (() => {
      let dom = Number(payDay);
      if (!Number.isFinite(dom)) {
        const d = new Date(payDay);
        dom = Number.isFinite(d.getTime()) ? d.getDate() : 1;
      }
      return Math.max(1, Math.min(31, dom || 1));
    })();

    for (const m of monthsUpToCurrent) {
      const items = monthGroups.get(m) || [];
      const incomes = items.filter((x) => x.type === "income");
      const expenses = items.filter((x) => x.type === "expense");
      const additionalIncome = incomes.reduce((s, x) => s + (x.amount || 0), 0);
      const totalExpenses = expenses.reduce((s, x) => s + (x.amount || 0), 0);
      const totalIncome = baseIncome + additionalIncome;

      const lastDay = new Date(currentYear, m + 1, 0).getDate();

      const ss = computeSpendingSpeedScore({
        income: totalIncome,
        expenses: totalExpenses,
        paydayDayOfMonth: paydayDom,
        year: currentYear,
        monthZeroBased: m,
        dayOfMonth: lastDay,
      });

      const ier = computeIncomeExpenseScore({
        income: totalIncome,
        expenses: totalExpenses,
      });

      const score = computeFinancialScore({
        goalProgressPct: null, // historical goal progress not available; excluded
        spendingSpeedScore: ss,
        incomeExpenseScore: ier,
        weights: { goal: 0.0, spending: 0.4, ratio: 0.6 },
      });

      result.push({
        month: m,
        label: `${monthLabel(m)} ${currentYear}`,
        totalIncome,
        totalExpenses,
        remaining: totalIncome - totalExpenses,
        transactions: items,
        score,
        ss,
        ier,
      });
    }
    return result;
  }, [monthGroups, monthsUpToCurrent, baseIncome, payDay, currentYear]);

  const lineChartData = useMemo(() => {
    return monthSummaries.map((m) => ({
      name: new Date(currentYear, m.month, 1).toLocaleDateString("en-US", {
        month: "short",
      }),
      Income: m.totalIncome,
      Expenses: m.totalExpenses,
      Remaining: m.remaining,
      Score: m.score,
    }));
  }, [monthSummaries, currentYear]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 text-white flex items-center justify-center shadow">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Monthly Reports
          </h1>
        </div>
        <button
          onClick={fetchAll}
          className="px-3 py-1.5 text-sm rounded-md border shadow-sm hover:bg-gray-50 active:bg-gray-100"
        >
          Refresh
        </button>
      </div>
      <div className="w-full h-72 md:h-80 lg:h-96 mb-6 border rounded-xl p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Remaining"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Score"
              stroke="#a855f7"
              strokeWidth={2}
              yAxisId={0}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {[...monthSummaries].reverse().map((m) => (
          <div
            key={m.month}
            className="border rounded-xl p-4 flex flex-col h-full shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">{m.label}</div>
              <div className="text-sm px-2 py-1 rounded-md bg-gray-100">
                Score: <span className="font-bold">{m.score}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm mb-4">
              <div className="border rounded-md p-2">
                <div className="text-gray-500">Income</div>
                <div className="font-semibold">{m.totalIncome}</div>
              </div>
              <div className="border rounded-md p-2">
                <div className="text-gray-500">Expenses</div>
                <div className="font-semibold">{m.totalExpenses}</div>
              </div>
              <div className="border rounded-md p-2">
                <div className="text-gray-500">Remaining</div>
                <div
                  className={`font-semibold ${
                    m.remaining >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.remaining}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div>Spending Speed: {m.ss}</div>
              <div>Income-Expense: {m.ier ?? "-"}</div>
            </div>

            <div className="flex-1 overflow-hidden border rounded-lg">
              <div className="max-h-64 overflow-auto divide-y">
                {m.transactions.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">
                    No transactions
                  </div>
                )}
                {m.transactions.map((t) => (
                  <div
                    key={t._id}
                    className="p-3 flex items-center justify-between"
                  >
                    <div className="flex flex-col text-left">
                      <div className="font-medium text-sm">
                        {t.description === "Added to Goals Wallet"
                          ? "+ Goals Wallet"
                          : t.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()} •{" "}
                        {t.category || t.type}
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {t.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
