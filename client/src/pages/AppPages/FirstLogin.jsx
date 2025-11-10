import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
  Globe,
  User,
} from "lucide-react";
import imagesData from "../../assets/data/images.json";
import { API_BASE_URL } from "../../api";

const FirstLogin = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    jobIncome: "",
    investmentIncome: "",
    sideIncome: "",
    needsRatio: "4",
    wantsRatio: "3",
    savingsRatio: "3",
    payday: "",
    currency: "INR",
    avatar: "",
  });

  const nextStep = () => {
    if (step === 1) {
      // Skip step 2 (budget allocation), go directly to step 3
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step === 3) {
      // Go back to step 1 (skip step 2)
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      needsRatio: Number(formData.needsRatio || 4),
      wantsRatio: Number(formData.wantsRatio || 3),
      savingsRatio: Number(formData.savingsRatio || 3),
      payday: paydayValue,
      currency: formData.currency,
      avatar: formData.avatar,
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/user/setup`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error("Setup Error", error);
    }
  };

  const totalSteps = 2; // Only 2 steps now (step 1 and step 3, skipping step 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Let's Set Up Your Plan, Wiser!
          </h1>
          <p className="text-gray-600 text-lg">
            Step {step === 1 ? 1 : 2} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {step === 1 && (
            <Step1Income formData={formData} handleChange={handleChange} />
          )}
          {/* Step 2 (Budget Allocation) is commented out - kept for future use */}
          {step === 3 && (
            <Step3Profile formData={formData} handleChange={handleChange} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              step === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md transform hover:scale-105"
            }`}
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Finish ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Step1Income = ({ formData, handleChange }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.user);
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  const incomeCards = [
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
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Your Monthly Income Sources
        </h2>
        {userData && (
          <p className="text-lg text-gray-600">
            Welcome,{" "}
            <span className="font-semibold text-indigo-600">
              {userData.name}
            </span>
            ! 👋
          </p>
        )}
        <p className="text-gray-500">
          Tell us about your income streams to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {incomeCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg"
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
                      onChange={(e) => handleChange(card.id, e.target.value)}
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
      {formData.jobIncome ||
      formData.investmentIncome ||
      formData.sideIncome ? (
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-center">
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
      ) : null}
    </div>
  );
};

// Step2Budget is commented out but kept for future use
/*
const Step2Budget = ({ formData, handleChange }) => {
  const TOTAL_RATIO = 10;

  // Local state for smooth dragging (avoids constant jumps)
  const [ratios, setRatios] = useState({
    needs: formData.needsRatio || 4,
    wants: formData.wantsRatio || 3,
    savings: formData.savingsRatio || 3,
  });

  const monthlyIncome =
    Number(formData.jobIncome || 0) +
    Number(formData.investmentIncome || 0) +
    Number(formData.sideIncome || 0);

  const { needsAmount, wantsAmount, savingsAmount } = useMemo(() => {
    return {
      needsAmount: ((ratios.needs / TOTAL_RATIO) * monthlyIncome).toFixed(2),
      wantsAmount: ((ratios.wants / TOTAL_RATIO) * monthlyIncome).toFixed(2),
      savingsAmount: ((ratios.savings / TOTAL_RATIO) * monthlyIncome).toFixed(
        2
      ),
    };
  }, [ratios, monthlyIncome]);

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

  // Keep updating only the active slider while dragging
  const handleDrag = (type, value) => {
    setRatios((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // On release, auto-adjust other sliders so total = TOTAL_RATIO
  const handleCommit = (type, value) => {
    let newNeeds = ratios.needs;
    let newWants = ratios.wants;
    let newSavings = ratios.savings;

    if (type === "needs") {
      newNeeds = value;
      const remaining = TOTAL_RATIO - newNeeds;
      const half = Math.floor(remaining / 2);
      newWants = half;
      newSavings = remaining - half;
    } else if (type === "wants") {
      newWants = value;
      newSavings = TOTAL_RATIO - newNeeds - newWants;
    } else if (type === "savings") {
      newSavings = value;
      newWants = TOTAL_RATIO - newNeeds - newSavings;
    }

    // Prevent negatives
    newNeeds = Math.max(0, newNeeds);
    newWants = Math.max(0, newWants);
    newSavings = Math.max(0, newSavings);

    const updated = {
      needs: newNeeds,
      wants: newWants,
      savings: newSavings,
    };

    setRatios(updated);
    handleChange("needsRatio", updated.needs);
    handleChange("wantsRatio", updated.wants);
    handleChange("savingsRatio", updated.savings);
  };

  const data = [
    { name: `Needs ₹${needsAmount}`, value: parseFloat(needsAmount) },
    { name: `Wants ₹${wantsAmount}`, value: parseFloat(wantsAmount) },
    { name: `Savings ₹${savingsAmount}`, value: parseFloat(savingsAmount) },
  ];

  return (
    <div className="flex flex-col items-center space-y-8 border-2 p-10 rounded-2xl w-[500px]">
      <h2 className="text-3xl font-semibold">
        Budget Allocation (Total = {TOTAL_RATIO})
      </h2>
      <p className="text-lg">
        Monthly Income: <strong>₹{monthlyIncome}</strong>
      </p>

      <div className="w-full">
        <label className="block text-xl mb-2">Needs ({ratios.needs})</label>
        <Slider.Root
          value={[ratios.needs]}
          onValueChange={(val) => handleDrag("needs", val[0])}
          onValueCommit={(val) => handleCommit("needs", val[0])}
          max={TOTAL_RATIO}
          step={1}
          className="relative flex items-center w-full select-none"
        >
          <Slider.Track className="bg-gray-300 grow rounded-full h-2">
            <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-green-600 rounded-full" />
        </Slider.Root>
        <p>₹{needsAmount}</p>
      </div>

      <div className="w-full">
        <label className="block text-xl mb-2">Wants ({ratios.wants})</label>
        <Slider.Root
          value={[ratios.wants]}
          onValueChange={(val) => handleDrag("wants", val[0])}
          onValueCommit={(val) => handleCommit("wants", val[0])}
          max={TOTAL_RATIO}
          step={1}
          className="relative flex items-center w-full select-none"
        >
          <Slider.Track className="bg-gray-300 grow rounded-full h-2">
            <Slider.Range className="absolute bg-yellow-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-yellow-600 rounded-full" />
        </Slider.Root>
        <p>₹{wantsAmount}</p>
      </div>

      <div className="w-full">
        <label className="block text-xl mb-2">Savings ({ratios.savings})</label>
        <Slider.Root
          value={[ratios.savings]}
          onValueChange={(val) => handleDrag("savings", val[0])}
          onValueCommit={(val) => handleCommit("savings", val[0])}
          max={TOTAL_RATIO}
          step={1}
          className="relative flex items-center w-full select-none"
        >
          <Slider.Track className="bg-gray-300 grow rounded-full h-2">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-blue-600 rounded-full" />
        </Slider.Root>
        <p>₹{savingsAmount}</p>
      </div>

      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};
*/

const Step3Profile = ({ formData, handleChange }) => {
  // Get owl mascot from images.json
  const owlMascot = imagesData.profile.find((p) => p.type === "owl");

  useEffect(() => {
    // Set owl as default avatar if not already set
    if (!formData.avatar && owlMascot) {
      handleChange("avatar", owlMascot.source);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaydayChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      const dayOfMonth = date.getDate();
      handleChange("payday", dayOfMonth.toString());
    } else {
      handleChange("payday", "");
    }
  };

  // Convert day of month back to a date for the input (use current month)
  const getDateFromDay = (day) => {
    if (!day) return "";
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Complete Your Profile
        </h2>
        <p className="text-gray-500">
          A few more details to personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mascot Selection */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <User className="w-5 h-5" />
            Choose Your Mascot
          </label>
          {owlMascot && (
            <div className="border-2 border-indigo-300 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={owlMascot.source}
                  alt="Owl Mascot"
                  className="w-32 h-32 object-contain"
                />
                <p className="font-semibold text-gray-700">Owl</p>
                <button
                  type="button"
                  onClick={() => handleChange("avatar", owlMascot.source)}
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
          )}
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
              value={getDateFromDay(formData.payday)}
              onChange={handlePaydayChange}
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
  );
};

export default FirstLogin;
