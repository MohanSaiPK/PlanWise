import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  X,
  Trash2,
  ReceiptText,
} from "lucide-react";
import IncomeCards from "../../components/cards/IncomeCards";
import { useIncome } from "../../hooks/useIncome";
import {
  TransactionModal,
  TransactionModalForm,
} from "../../components/modals/TransactionModal";
// replaced page icon with lucide ReceiptText for consistency

const Transactions = () => {
  const { incomeData, loading } = useIncome();
  const { resetIncomes } = useIncome();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

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

  // Filtered with search/category
  const filteredTransactions = currentMonthTransactions.filter((t) => {
    const matchCategory =
      filterCategory === "All" || t.category === filterCategory;
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="flex flex-row items-center justify-center gap-4  w-full m-4 p-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl p-2 bg-gradient-to-br from-rose-500 via-orange-500 to-yellow-500 text-white shadow">
            <ReceiptText className="w-8 h-8" />
          </div>
          <div className="flex flex-1 items-start justify-center">
            <IncomeCards data={incomeData} loading={loading} />
          </div>

          <div className="flex gap-2">
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
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Search */}
            <div className="md:col-span-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by description or category"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                {search && (
                  <button
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <div className="relative">
                <Filter
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border pl-10 pr-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="All">All categories</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Business">Business</option>
                  <option value="Investments">Investments</option>
                  <option value="Other">Other</option>
                  <option value="Goal">Goal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Lists */}
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expenses Column */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-semibold">Expenses</h3>
              <span className="text-sm text-red-600 font-medium">
                -₹
                {filteredTransactions
                  .filter((t) => t.type === "expense")
                  .reduce((s, t) => s + (t.amount || 0), 0)}
              </span>
            </div>
            <div className="max-h-[60vh] overflow-auto divide-y">
              {filteredTransactions.filter((t) => t.type === "expense")
                .length === 0 && (
                <div className="p-4 text-sm text-gray-500">No expenses</div>
              )}
              {filteredTransactions
                .filter((t) => t.type === "expense")
                .map((t) => (
                  <div
                    key={t._id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-10 rounded-full bg-red-500" />
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
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => handleDeleteTransaction(t._id)}
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
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-semibold">Income</h3>
              <span className="text-sm text-green-600 font-medium">
                +₹
                {filteredTransactions
                  .filter((t) => t.type === "income")
                  .reduce((s, t) => s + (t.amount || 0), 0)}
              </span>
            </div>
            <div className="max-h-[60vh] overflow-auto divide-y">
              {filteredTransactions.filter((t) => t.type === "income")
                .length === 0 && (
                <div className="p-4 text-sm text-gray-500">No income</div>
              )}
              {filteredTransactions
                .filter((t) => t.type === "income")
                .map((t) => (
                  <div
                    key={t._id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-10 rounded-full bg-green-500" />
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
