import React, { useState } from "react";
import { X } from "lucide-react";
import Numpad from "./Numpad.jsx";

// Modal Component
export const TransactionModal = ({ title, onClose, onSubmit, children }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-200"
    onClick={onClose}
  >
    <div
      className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 space-y-4 transform transition-all duration-200 scale-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>
      {children}
      <button
        onClick={onSubmit}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
          title === "Add Income"
            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
        }`}
      >
        {title}
      </button>
    </div>
  </div>
);

// Modal Form Component
export const TransactionModalForm = ({ txn, setTxn, isExpense = false }) => {
  const [showNumpad, setShowNumpad] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {new Date(txn.date).toLocaleDateString()} - {txn.time}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={txn.category}
          onChange={(e) => setTxn({ ...txn, category: e.target.value })}
          className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
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
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          placeholder="Enter description"
          value={txn.description}
          onChange={(e) => setTxn({ ...txn, description: e.target.value })}
          className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (₹)
        </label>
        <button
          type="button"
          onClick={() => setShowNumpad(true)}
          className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-left bg-white hover:border-indigo-300 cursor-pointer"
        >
          {txn.amount ? (
            <span className="text-lg font-semibold text-gray-900">
              ₹
              {Number(txn.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          ) : (
            <span className="text-gray-400">Tap to enter amount</span>
          )}
        </button>
      </div>

      {/* Numpad Modal */}
      {showNumpad && (
        <Numpad
          value={txn.amount}
          onChange={(value) => setTxn({ ...txn, amount: value })}
          onClose={() => setShowNumpad(false)}
        />
      )}
    </div>
  );
};
