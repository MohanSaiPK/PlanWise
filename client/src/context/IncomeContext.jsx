import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { API_BASE_URL } from "../api";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [baseIncome, setBaseIncome] = useState(null);
  const [additionalIncome, setAdditionalIncome] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchedMonth, setFetchedMonth] = useState(null);
  const [fetchedYear, setFetchedYear] = useState(null);

  const setIncomes = ({ base = null, additional = null, expenses = null }) => {
    setBaseIncome(base);
    setAdditionalIncome(additional);
    setTotalExpenses(expenses ?? 0);
    setTotalIncome((base ?? 0) + (additional ?? 0));
  };

  const resetIncomes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/income-expense`, {
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
        if (typeof data.month === "number") setFetchedMonth(data.month);
        if (typeof data.year === "number") setFetchedYear(data.year);
      } else {
        console.error(
          "Error fetching monthly income/expense:",
          data.message || data.error
        );
      }
    } catch (error) {
      console.error("Error fetching monthly income/expense:", error);
    }
  }, []);

  useEffect(() => {
    resetIncomes().finally(() => setLoading(false));
  }, [resetIncomes]);

  // Auto-refresh when month/year rolls over or when tab regains focus
  useEffect(() => {
    const checkMonthRollover = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      if (
        fetchedMonth !== null &&
        fetchedYear !== null &&
        (currentMonth !== fetchedMonth || currentYear !== fetchedYear)
      ) {
        resetIncomes();
      }
    };

    const intervalId = setInterval(checkMonthRollover, 60 * 1000); // check every minute
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        checkMonthRollover();
      }
    };
    window.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchedMonth, fetchedYear, resetIncomes]);

  const incomeData = useMemo(
    () => [
      {
        id: 1,
        title: "Total Income",
        amount: totalIncome,
        icon: "💰",
        baseIncome,
        additionalIncome,
      },
      {
        id: 2,
        title: "Total Expenses",
        amount: totalExpenses,
        icon: "📅",
      },
      {
        id: 3,
        title: "Remaining",
        amount:
          totalIncome != null && totalExpenses != null
            ? totalIncome - totalExpenses
            : null,
        icon: "💵",
      },
    ],
    [totalIncome, totalExpenses, baseIncome, additionalIncome]
  );

  const value = {
    baseIncome,
    additionalIncome,
    totalIncome,
    totalExpenses,
    loading,
    incomeData,
    setIncomes,
    resetIncomes,
  };

  return (
    <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>
  );
};
export default IncomeContext;
