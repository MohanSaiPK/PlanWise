import React, { useState } from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useIncome } from "../../hooks/useIncome";
import {
  TransactionModal,
  TransactionModalForm,
} from "../modals/TransactionModal";

const FloatingActionButton = () => {
  const { resetIncomes } = useIncome();
  const [isOpen, setIsOpen] = useState(false);
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

  const openExpenseModal = () => {
    const now = new Date();
    setNewExpense({
      date: now.toISOString(),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      category: "Food",
      description: "",
      amount: "",
    });
    setIsExpModalOpen(true);
    setIsOpen(false);
  };

  const openIncomeModal = () => {
    const now = new Date();
    setNewIncome({
      date: now.toISOString(),
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      category: "Bonus",
      description: "",
      amount: "",
    });
    setIsIncModalOpen(true);
    setIsOpen(false);
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

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTxn),
      });

      await res.json();

      if (res.ok) {
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
        // Refresh the page data by triggering a custom event
        window.dispatchEvent(new CustomEvent("transactionAdded"));
      } else {
        alert("Failed to add transaction. Please try again.");
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Action Buttons */}
        <div
          className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {/* Income Button */}
          <button
            onClick={openIncomeModal}
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
            aria-label="Add Income"
          >
            <TrendingUp
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="font-medium">Add Income</span>
          </button>

          {/* Expense Button */}
          <button
            onClick={openExpenseModal}
            className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
            aria-label="Add Expense"
          >
            <TrendingDown
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="font-medium">Add Expense</span>
          </button>
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
          aria-label="Toggle actions"
        >
          <Plus size={28} className="transition-transform duration-300" />
        </button>
      </div>

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
    </>
  );
};

export default FloatingActionButton;
