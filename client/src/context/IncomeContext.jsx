import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [baseIncome, setBaseIncome] = useState(null);
  const [additionalIncome, setAdditionalIncome] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [loading, setLoading] = useState(true);

  const setIncomes = ({ base = null, additional = null, expenses = null }) => {
    setBaseIncome(base);
    setAdditionalIncome(additional);
    setTotalExpenses(expenses ?? 0);
    setTotalIncome((base ?? 0) + (additional ?? 0));
  };

  const resetIncomes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
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
  }, []);

  useEffect(() => {
    resetIncomes().finally(() => setLoading(false));
  }, [resetIncomes]);

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
