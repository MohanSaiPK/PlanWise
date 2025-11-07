import React, { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
  Globe,
  User,
  Save,
} from "lucide-react";
import imagesData from "../../assets/data/images.json";

const SettingsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    jobIncome: "",
    investmentIncome: "",
    sideIncome: "",
    payday: "",
    currency: "INR",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch current user data
  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        // Populate form with existing data
        setFormData({
          jobIncome: data.user.jobIncome || "",
          investmentIncome: data.user.investmentIncome || "",
          sideIncome: data.user.sideIncome || "",
          payday: data.user.payday || "",
          currency: data.user.currency || "INR",
          avatar: data.user.avatar || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Extract day of month from payday if it's a date string
    let paydayValue = formData.payday;
    if (paydayValue && paydayValue.includes("-")) {
      const date = new Date(paydayValue);
      paydayValue = date.getDate().toString();
    }

    const payload = {
      jobIncome: Number(formData.jobIncome || 0),
      investmentIncome: Number(formData.investmentIncome || 0),
      sideIncome: Number(formData.sideIncome || 0),
      payday: paydayValue,
      currency: formData.currency,
      avatar: formData.avatar,
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/user/setup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh income data
        window.dispatchEvent(new CustomEvent("settingsUpdated"));
        onClose();
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Setup Error", error);
      alert("An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close settings"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-8">
            {/* Income Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-indigo-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Income Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: "jobIncome",
                    label: "Job Income",
                    placeholder: "Enter your salary",
                    icon: Briefcase,
                    color: "from-blue-500 to-cyan-500",
                    value: formData.jobIncome,
                  },
                  {
                    id: "investmentIncome",
                    label: "Investment Income",
                    placeholder: "Enter returns",
                    icon: TrendingUp,
                    color: "from-green-500 to-emerald-500",
                    value: formData.investmentIncome,
                  },
                  {
                    id: "sideIncome",
                    label: "Side Income",
                    placeholder: "Enter side income",
                    icon: DollarSign,
                    color: "from-purple-500 to-pink-500",
                    value: formData.sideIncome,
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <label className="text-lg font-semibold text-gray-700 text-center">
                          {card.label}
                        </label>
                        <div className="w-full">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                              ₹
                            </span>
                            <input
                              type="number"
                              placeholder={card.placeholder}
                              value={card.value}
                              onChange={(e) =>
                                handleChange(card.id, e.target.value)
                              }
                              className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-lg"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Income Display */}
              {(formData.jobIncome ||
                formData.investmentIncome ||
                formData.sideIncome) && (
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-center">
                  <p className="text-sm opacity-90">Total Monthly Income</p>
                  <p className="text-3xl font-bold">
                    ₹
                    {(
                      Number(formData.jobIncome || 0) +
                      Number(formData.investmentIncome || 0) +
                      Number(formData.sideIncome || 0)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Profile Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mascot Selection */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <User className="w-5 h-5" />
                    Choose Your Mascot
                  </label>
                  {imagesData.profile
                    .filter((p) => p.type === "owl")
                    .map((owlMascot) => (
                      <div
                        key={owlMascot.type}
                        className="border-2 border-indigo-300 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col items-center space-y-4">
                          <img
                            src={owlMascot.source}
                            alt="Owl Mascot"
                            className="w-32 h-32 object-contain"
                          />
                          <p className="font-semibold text-gray-700">Owl</p>
                          <button
                            type="button"
                            onClick={() =>
                              handleChange("avatar", owlMascot.source)
                            }
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              formData.avatar === owlMascot.source
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {formData.avatar === owlMascot.source
                              ? "Selected ✓"
                              : "Select"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Profile Details */}
                <div className="space-y-6">
                  {/* Payday */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                      <Calendar className="w-5 h-5" />
                      Payday (Day of Month)
                    </label>
                    <input
                      type="date"
                      value={
                        formData.payday && !formData.payday.includes("-")
                          ? (() => {
                              const today = new Date();
                              const year = today.getFullYear();
                              const month = today.getMonth();
                              return `${year}-${String(month + 1).padStart(
                                2,
                                "0"
                              )}-${String(formData.payday).padStart(2, "0")}`;
                            })()
                          : formData.payday || ""
                      }
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        if (dateValue) {
                          const date = new Date(dateValue);
                          const dayOfMonth = date.getDate();
                          handleChange("payday", dayOfMonth.toString());
                        } else {
                          handleChange("payday", "");
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                    {formData.payday && (
                      <p className="text-sm text-gray-500">
                        Selected: Day {formData.payday} of each month
                      </p>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                      <Globe className="w-5 h-5" />
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Save size={20} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
