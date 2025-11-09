import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  X,
  Trash2,
  ReceiptText,
  BarChart3,
  Goal,
  Receipt,
  Drama,
  TrainFront,
  Hamburger,
  Shapes,
  Briefcase,
  TrendingUp,
  Gift,
} from "lucide-react";
import IncomeCards from "../../components/cards/IncomeCards";
import { useIncome } from "../../hooks/useIncome";
import {
  TransactionModal,
  TransactionModalForm,
} from "../../components/modals/TransactionModal";
import { Input } from "@heroui/react";
import { SearchIcon } from "../../components/ui/SearchIcon";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
// replaced page icon with lucide ReceiptText for consistency

const Transactions = () => {
  const { incomeData, loading } = useIncome();
  const { resetIncomes } = useIncome();
  const [transactions, setTransactions] = useState([]);
  const [expenseSearch, setExpenseSearch] = useState("");
  const [incomeSearch, setIncomeSearch] = useState("");
  const [expenseFilterCategory, setExpenseFilterCategory] = useState("All");
  const [incomeFilterCategory, setIncomeFilterCategory] = useState("All");
  const [showExpenseChart, setShowExpenseChart] = useState(false);
  const [showIncomeChart, setShowIncomeChart] = useState(false);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isIncModalOpen, setIsIncModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    date: "",
    time: "",
    category: "Food",
    description: "",
    amount: "",
  });

  const [newIncome, setNewIncome] = useState({
    date: "",
    time: "",
    category: "Bonus",
    description: "",
    amount: "",
  });

  useEffect(() => {
    fetchTransactions();

    // Listen for transactions added from FAB
    const handleTransactionAdded = () => {
      fetchTransactions();
    };

    window.addEventListener("transactionAdded", handleTransactionAdded);

    return () => {
      window.removeEventListener("transactionAdded", handleTransactionAdded);
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
        console.error("API error or invalid response:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setTransactions([]);
    }
  };

  const handleAddTransaction = async (txn, type) => {
    if (!txn.description || !txn.amount) {
      alert("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    const newTxn = {
      ...txn,
      type,
      amount: Number(txn.amount),
    };

    const res = await fetch("http://localhost:5000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTxn),
    });

    const savedTxn = await res.json();

    setTransactions((prev) => [savedTxn, ...prev]);

    await resetIncomes();

    setIsExpModalOpen(false);
    setIsIncModalOpen(false);
    setNewExpense({
      date: "",
      time: "",
      category: "Food",
      description: "",
      amount: "",
    });
    setNewIncome({
      date: "",
      time: "",
      category: "Bonus",
      description: "",
      amount: "",
    });
  };

  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions((prev) => prev.filter((txn) => txn._id !== id));

    await resetIncomes();
  };

  const openExpenseModal = () => {
    const now = new Date();
    setNewExpense({
      ...newExpense,
      date: now.toISOString(),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    });
    setIsExpModalOpen(true);
  };

  const openIncomeModal = () => {
    const now = new Date();
    setNewIncome({
      ...newIncome,
      date: now.toISOString(),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    });
    setIsIncModalOpen(true);
  };

  // Filter for current month
  const currentMonthTransactions = transactions.filter((t) => {
    const txnDate = new Date(t.date);
    const now = new Date();
    return (
      txnDate.getMonth() === now.getMonth() &&
      txnDate.getFullYear() === now.getFullYear()
    );
  });

  // Filtered expenses with search/category
  const filteredExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .filter((t) => {
      const matchCategory =
        expenseFilterCategory === "All" || t.category === expenseFilterCategory;
      const matchSearch =
        expenseSearch === "" ||
        t.description.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(expenseSearch.toLowerCase());
      return matchCategory && matchSearch;
    });

  // Filtered income with search/category
  const filteredIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .filter((t) => {
      const matchCategory =
        incomeFilterCategory === "All" || t.category === incomeFilterCategory;
      const matchSearch =
        incomeSearch === "" ||
        t.description.toLowerCase().includes(incomeSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(incomeSearch.toLowerCase());
      return matchCategory && matchSearch;
    });

  // Calculate category totals for expenses
  const expenseCategoryTotals = filteredExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount || 0;
    return acc;
  }, {});

  const expenseChartData = Object.entries(expenseCategoryTotals).map(
    ([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    })
  );

  // Calculate category totals for income
  const incomeCategoryTotals = filteredIncome.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount || 0;
    return acc;
  }, {});

  const incomeChartData = Object.entries(incomeCategoryTotals).map(
    ([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    })
  );

  // Color arrays for charts
  const expenseColors = [
    "#EF4444", // red-500
    "#F97316", // orange-500
    "#F59E0B", // amber-500
    "#EAB308", // yellow-500
    "#84CC16", // lime-500
    "#10B981", // emerald-500
    "#14B8A6", // teal-500
  ];

  const incomeColors = [
    "#10B981", // emerald-500
    "#14B8A6", // teal-500
    "#06B6D4", // cyan-500
    "#3B82F6", // blue-500
    "#6366F1", // indigo-500
  ];

  // Calculate totals for percentage
  const expenseTotal = filteredExpenses.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const incomeTotal = filteredIncome.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );

  // Get icon for expense category
  const getExpenseIcon = (category) => {
    const iconProps = { size: 20, className: "text-red-500" };
    switch (category) {
      case "Goal":
        return <Goal {...iconProps} className="text-yellow-500" />;
      case "Bills":
        return <Receipt {...iconProps} className="text-zinc-500" />;
      case "Entertainment":
        return <Drama {...iconProps} className="text-blue-500" />;
      case "Transport":
        return <TrainFront {...iconProps} className="text-emerald-500" />;
      case "Food":
        return <Hamburger {...iconProps} className="text-amber-500" />;
      default:
        return <Shapes {...iconProps} className="text-gray-500" />;
    }
  };

  // Get icon for income category
  const getIncomeIcon = (category) => {
    const iconProps = { size: 20, className: "text-green-500" };
    switch (category) {
      case "Bonus":
        return <Gift {...iconProps} className="text-pink-500" />;
      case "Business":
        return <Briefcase {...iconProps} className="text-lime-500" />;
      case "Investments":
        return <TrendingUp {...iconProps} className="text-teal-500" />;
      default:
        return <Shapes {...iconProps} className="text-gray-500" />;
    }
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload, total }) => {
    if (active && payload && payload.length) {
      const percentage =
        total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className=" space-y-0">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="flex flex-row items-center justify-center gap-4  w-full m-4 p-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl p-2 bg-gradient-to-br from-rose-500 via-orange-500 to-yellow-500 text-white shadow">
            <ReceiptText className="w-8 h-8" />
          </div>
          <div className="flex flex-1 items-start justify-center">
            <IncomeCards data={incomeData} loading={loading} />
          </div>

          {/* <div className="flex gap-2">
            <button
              onClick={openExpenseModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusCircle size={20} />
            </button>
            <button
              onClick={openIncomeModal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            >
              <PlusCircle size={20} />
            </button>
          </div> */}
        </div>
      </div>

      {/* Responsive Lists */}
      {loading ? (
        <div className="flex justify-center items-center h-40 p-4">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 ">
          {/* Expenses Column */}
          <div className="bg-white shadow rounded-lg overflow-hidden border-1 border-divider">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="font-semibold whitespace-nowrap">Expenses</h3>
                  <div className="relative flex items-center justify-center rounded-lg border-1 border-divider">
                    <Input
                      classNames={{
                        base: "w-48 h-10",
                        mainWrapper: "h-full",
                        input: "text-xs focus:outline-none",
                        inputWrapper:
                          "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 border-none shadow-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-none",
                      }}
                      placeholder="Search expenses..."
                      size="sm"
                      startContent={
                        <div className="pl-2 pr-2">
                          <SearchIcon size={16} />
                        </div>
                      }
                      type="search"
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                    />
                    {expenseSearch && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                        onClick={() => setExpenseSearch("")}
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      value={expenseFilterCategory}
                      onChange={(e) => setExpenseFilterCategory(e.target.value)}
                      className="h-10 pl-9 pr-4 py-2 text-xs border-1 border-divider rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-default-400/20 dark:bg-default-500/20 whitespace-nowrap"
                    >
                      <option value="All">All</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Bills">Bills</option>
                      <option value="Other">Other</option>
                      <option value="Goal">Goal</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowExpenseChart(!showExpenseChart)}
                    className={`h-10 px-3 py-2 text-xs border-1 border-divider rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      showExpenseChart
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-default-400/20 dark:bg-default-500/20 hover:bg-default-400/30"
                    }`}
                    aria-label="Toggle chart"
                  >
                    <BarChart3 size={16} />
                  </button>
                </div>
                <span className="text-sm text-red-600 font-medium whitespace-nowrap ml-2">
                  -₹{expenseTotal}
                </span>
              </div>
            </div>
            {showExpenseChart && (
              <div className="px-2 sm:px-4 py-4 border-b bg-gray-50">
                {expenseChartData.length > 0 ? (
                  <div className="w-full h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={expenseColors[index % expenseColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip total={expenseTotal} />}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: "12px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                    No expense data to display
                  </div>
                )}
              </div>
            )}
            <div className="max-h-[60vh] overflow-auto divide-y">
              {filteredExpenses.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No expenses</div>
              )}
              {filteredExpenses.map((t) => (
                <div
                  key={t._id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    {getExpenseIcon(t.category)}
                    <div className="flex flex-col">
                      <div className="font-medium text-sm">
                        {t.description || t.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()} • {t.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-red-600">
                      -₹{t.amount}
                    </div>
                    <button
                      className={`p-2 rounded hover:bg-gray-100 ${
                        t.category === "Goal"
                          ? " text-gray-400 disabled:cursor-not-allowed"
                          : "text-red-600 disabled:cursor-not-allowed"
                      }`}
                      onClick={() =>
                        t.category === "Goal"
                          ? null
                          : handleDeleteTransaction(t._id)
                      }
                      aria-label="Delete expense"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Column */}
          <div className="bg-white shadow rounded-lg overflow-hidden border-1 border-divider">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="font-semibold whitespace-nowrap">Income</h3>
                  <div className="relative flex items-center justify-center rounded-lg border-1 border-divider">
                    <Input
                      classNames={{
                        base: "w-48 h-10",
                        mainWrapper: "h-full",
                        input: "text-xs focus:outline-none",
                        inputWrapper:
                          "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 border-none shadow-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-none",
                      }}
                      placeholder="Search income..."
                      size="sm"
                      startContent={
                        <div className="pl-2 pr-2">
                          <SearchIcon size={16} />
                        </div>
                      }
                      type="search"
                      value={incomeSearch}
                      onChange={(e) => setIncomeSearch(e.target.value)}
                    />
                    {incomeSearch && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                        onClick={() => setIncomeSearch("")}
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      value={incomeFilterCategory}
                      onChange={(e) => setIncomeFilterCategory(e.target.value)}
                      className="h-10 pl-9 pr-4 py-2 text-xs border-1 border-divider rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-default-400/20 dark:bg-default-500/20 whitespace-nowrap"
                    >
                      <option value="All">All</option>
                      <option value="Bonus">Bonus</option>
                      <option value="Business">Business</option>
                      <option value="Investments">Investments</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowIncomeChart(!showIncomeChart)}
                    className={`h-10 px-3 py-2 text-xs border-1 border-divider rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      showIncomeChart
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-default-400/20 dark:bg-default-500/20 hover:bg-default-400/30"
                    }`}
                    aria-label="Toggle chart"
                  >
                    <BarChart3 size={16} />
                  </button>
                </div>
                <span className="text-sm text-green-600 font-medium whitespace-nowrap ml-2">
                  +₹{incomeTotal}
                </span>
              </div>
            </div>
            {showIncomeChart && (
              <div className="px-2 sm:px-4 py-4 border-b bg-gray-50">
                {incomeChartData.length > 0 ? (
                  <div className="w-full h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {incomeChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={incomeColors[index % incomeColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip total={incomeTotal} />}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: "12px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                    No income data to display
                  </div>
                )}
              </div>
            )}
            <div className="max-h-[60vh] overflow-auto divide-y">
              {filteredIncome.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No income</div>
              )}
              {filteredIncome.map((t) => (
                <div
                  key={t._id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    {getIncomeIcon(t.category)}
                    <div className="flex flex-col">
                      <div className="font-medium text-sm">
                        {t.description || t.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()} • {t.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-green-600">
                      +₹{t.amount}
                    </div>
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      onClick={() => handleDeleteTransaction(t._id)}
                      aria-label="Delete income"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpModalOpen && (
        <TransactionModal
          title="Add Expense"
          onClose={() => setIsExpModalOpen(false)}
          onSubmit={() => handleAddTransaction(newExpense, "expense")}
        >
          <TransactionModalForm
            txn={newExpense}
            setTxn={setNewExpense}
            isExpense
          />
        </TransactionModal>
      )}

      {/* Income Modal */}
      {isIncModalOpen && (
        <TransactionModal
          title="Add Income"
          onClose={() => setIsIncModalOpen(false)}
          onSubmit={() => handleAddTransaction(newIncome, "income")}
        >
          <TransactionModalForm txn={newIncome} setTxn={setNewIncome} />
        </TransactionModal>
      )}
    </div>
  );
};

export default Transactions;
