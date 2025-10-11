import React, { useEffect, useState } from "react";
import { PlusCircle, Search, Filter, X, Trash2 } from "lucide-react";
import IncomeCards from "../../components/cards/IncomeCards";
import { useIncome } from "../../hooks/useIncome";
import { GrTransaction } from "react-icons/gr";

const Transactions = () => {
  const { incomeData, loading } = useIncome();
  const { totalIncome, totalExpenses, resetIncomes } = useIncome();
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
          <div className="flex items-center justify-center w-1/10 h-full border-2 rounded-xl p-2">
            <GrTransaction className="w-full h-full" />
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
      <div className="flex gap-4 items-center p-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border pl-10 pr-4 py-2 rounded-lg"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border pl-10 pr-4 py-2 rounded-lg"
          >
            <option value="All">All</option>
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 capitalize">{txn.type}</td>
                    <td className="p-3">{txn.category}</td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3 font-semibold">₹{txn.amount}</td>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => handleDeleteTransaction(txn._id)}
                    >
                      <Trash2 size={18} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">
                    No transactions this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Modal */}
      {isExpModalOpen && (
        <Modal
          title="Add Expense"
          onClose={() => setIsExpModalOpen(false)}
          onSubmit={() => handleAddTransaction(newExpense, "expense")}
        >
          <ModalForm txn={newExpense} setTxn={setNewExpense} isExpense />
        </Modal>
      )}

      {/* Income Modal */}
      {isIncModalOpen && (
        <Modal
          title="Add Income"
          onClose={() => setIsIncModalOpen(false)}
          onSubmit={() => handleAddTransaction(newIncome, "income")}
        >
          <ModalForm txn={newIncome} setTxn={setNewIncome} />
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
      >
        {title}
      </button>
    </div>
  </div>
);

const ModalForm = ({ txn, setTxn, isExpense = false }) => (
  <>
    <p>
      {new Date(txn.date).toLocaleDateString()} - {txn.time}
    </p>
    <select
      value={txn.category}
      onChange={(e) => setTxn({ ...txn, category: e.target.value })}
      className="border p-2 w-full rounded"
    >
      {isExpense ? (
        <>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
        </>
      ) : (
        <>
          <option value="Bonus">Bonus</option>
          <option value="Business">Business</option>
          <option value="Investments">Investments</option>
          <option value="Other">Other</option>
        </>
      )}
    </select>
    <input
      type="text"
      placeholder="Description"
      value={txn.description}
      onChange={(e) => setTxn({ ...txn, description: e.target.value })}
      className="border p-2 w-full rounded"
    />
    <input
      type="number"
      placeholder="Amount"
      value={txn.amount}
      onChange={(e) => setTxn({ ...txn, amount: e.target.value })}
      className="border p-2 w-full rounded"
    />
  </>
);

export default Transactions;
