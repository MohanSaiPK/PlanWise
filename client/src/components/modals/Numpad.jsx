import React, { useState, useEffect } from "react";
import { Delete, X } from "lucide-react";

const Numpad = ({ value, onChange, onClose }) => {
  const [displayValue, setDisplayValue] = useState(value || "");

  // Sync with external value changes when numpad opens
  useEffect(() => {
    setDisplayValue(value || "");
  }, [value]);

  const handleNumberClick = (num) => {
    const newValue = displayValue + num;
    // Limit to reasonable amount (999999.99)
    if (newValue.length <= 10) {
      setDisplayValue(newValue);
      onChange(newValue);
    }
  };

  const handleDecimalClick = () => {
    if (!displayValue.includes(".")) {
      const newValue = displayValue + ".";
      setDisplayValue(newValue);
      onChange(newValue);
    }
  };

  const handleDelete = () => {
    const newValue = displayValue.slice(0, -1);
    setDisplayValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setDisplayValue("");
    onChange("");
  };

  const formatDisplay = (val) => {
    if (!val) return "0";
    // Format with commas for thousands
    const parts = val.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Enter Amount</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close numpad"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Display */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ₹{formatDisplay(displayValue)}
              </div>
              {displayValue && (
                <div className="text-sm text-gray-500 mt-1">
                  {displayValue}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Numpad */}
        <div className="p-4 bg-white">
          <div className="grid grid-cols-3 gap-3">
            {/* Row 1 */}
            <button
              onClick={() => handleNumberClick("1")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              1
            </button>
            <button
              onClick={() => handleNumberClick("2")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              2
            </button>
            <button
              onClick={() => handleNumberClick("3")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              3
            </button>

            {/* Row 2 */}
            <button
              onClick={() => handleNumberClick("4")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              4
            </button>
            <button
              onClick={() => handleNumberClick("5")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              5
            </button>
            <button
              onClick={() => handleNumberClick("6")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              6
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleNumberClick("7")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              7
            </button>
            <button
              onClick={() => handleNumberClick("8")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              8
            </button>
            <button
              onClick={() => handleNumberClick("9")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              9
            </button>

            {/* Row 4 */}
            <button
              onClick={handleDecimalClick}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              .
            </button>
            <button
              onClick={() => handleNumberClick("0")}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-semibold text-xl transition-all duration-150 transform active:scale-95"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-14 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-lg flex items-center justify-center transition-all duration-150 transform active:scale-95"
              aria-label="Delete"
            >
              <Delete size={20} className="text-red-600" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              onClick={handleClear}
              className="h-12 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg font-semibold text-gray-700 transition-all duration-150 transform active:scale-95"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-150 transform active:scale-95 shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numpad;

