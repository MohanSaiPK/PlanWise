import React, { useEffect, useState } from "react";
import { PlusCircle, Search, Filter, X, Trash2 } from "lucide-react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Transactions = () => {
  const [loading, setLoading] = useState(true);

  // Dummy expense data
  const [transactions, setTransactions] = useState([
    //   {
    //     id: 1,
    //     date: "2025-08-01",
    //     category: "Food",
    //     description: "Groceries",
    //     amount: 1200,
    //   },
    //   {
    //     id: 2,
    //     date: "2025-08-02",
    //     category: "Transport",
    //     description: "Uber ride",
    //     amount: 450,
    //   },
    //   {
    //     id: 3,
    //     date: "2025-08-03",
    //     category: "Entertainment",
    //     description: "Netflix",
    //     amount: 499,
    //   },
    //   {
    //     id: 4,
    //     date: "2025-08-04",
    //     category: "Bills",
    //     description: "Electricity Bill",
    //     amount: 1500,
    //   },
    //
  ]);

  useEffect(() => {
    // Fetch data from API
    fetchTransactions();
  }, []);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "Food",
    description: "",
    amount: "",
  });

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    return (
      (filterCategory === "All" || t.category === filterCategory) &&
      (t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Pie chart data
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Add new expense
  const handleAddExpense = async () => {
    if (!newExpense.date || !newExpense.description || !newExpense.amount) {
      alert("Please fill in all fields");
      return;
    }
    await addTransaction({
      ...newExpense,
      amount: Number(newExpense.amount),
      type: "expense",
    });
    await fetchTransactions();
    setIsModalOpen(false);
    setNewExpense({ date: "", category: "Food", description: "", amount: "" });
  };

  const handleDetleteExpense = async (id) => {
    await deleteTransaction(id);
    await fetchTransactions();
  };

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (newTxn) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTxn),
    });
    const data = await response.json();
    setTransactions((prev) => [data, ...prev]);
  };

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTransactions((prev) => prev.filter((txn) => txn._id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex space-x-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
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
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <h1>Loading....</h1>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {txn.category}
                      </span>
                    </td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3 font-semibold">₹{txn.amount}</td>

                    <td
                      className="p-3"
                      onClick={() => handleDetleteExpense(txn._id)}
                    >
                      {" "}
                      <Trash2 size={20} />{" "}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
        <Pie data={chartData} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Expense</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
            <button
              onClick={handleAddExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
