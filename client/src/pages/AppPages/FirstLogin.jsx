import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";
import { useAuth } from "../../hooks/useAuth";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect } from "react";

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

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // console.log(formData.jobIncome, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      jobIncome: Number(formData.jobIncome || 0),
      investmentIncome: Number(formData.investmentIncome || 0),
      sideIncome: Number(formData.sideIncome || 0),
      needsRatio: Number(formData.needsRatio || 0),
      wantsRatio: Number(formData.wantsRatio || 0),
      savingsRatio: Number(formData.savingsRatio || 0),
      payday: formData.payday,
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
        setUser(data.user);
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error("Setup Error", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-20">
      <h1 className="text-5xl">Let's Set Up Your Plan, Wiser!</h1>

      {step === 1 && (
        <Step1Income formData={formData} handleChange={handleChange} />
      )}
      {step === 2 && (
        <Step2Budget formData={formData} handleChange={handleChange} />
      )}
      {step === 3 && (
        <Step3Profile formData={formData} handleChange={handleChange} />
      )}

      <div className="flex items-center justify-center space-x-128">
        {step > 1 && <button onClick={prevStep}> Back</button>}
        {step < 3 && <button onClick={nextStep}> Next</button>}
        {step === 3 && <button onClick={handleSubmit}> Finish</button>}
      </div>
    </div>
  );
};

const Step1Income = ({ formData, handleChange }) => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.user);
          console.log("User profile fetched:", data.user);
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (
    <div className="flex flex-col space-y-6 border-2 p-16 rounded-2xl">
      <h2 className="text-3xl">Your Monthly Income Sources</h2>
      <p className="text-lg">User: {userData.name}</p>
      <div className="flex space-x-6 items-center justify-around w-128">
        <label className="text-xl">Job Income</label>
        <input
          type="number"
          placeholder="Enter Salary"
          value={formData.jobIncome}
          onChange={(e) => handleChange("jobIncome", e.target.value)}
          className="p-4"
        />
      </div>
      <div className="flex space-x-6 items-center justify-around w-128">
        <label className="text-xl">Investment Income</label>
        <input
          type="number"
          placeholder="Enter Returns"
          value={formData.investmentIncome}
          onChange={(e) => handleChange("investmentIncome", e.target.value)}
          className="p-4"
        />
      </div>
      <div className="flex space-x-6 items-center justify-around w-128">
        <label className="text-xl ">Side Income</label>
        <input
          type="number"
          placeholder="Enter Side Income"
          value={formData.sideIncome}
          onChange={(e) => handleChange("sideIncome", e.target.value)}
          className="p-4"
        />
      </div>
    </div>
  );
};

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

      {/* Needs */}
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

      {/* Wants */}
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

      {/* Savings */}
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

      {/* Chart */}
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

const Step3Profile = ({ formData, handleChange }) => {
  return (
    <div className="flex flex-col justify-between items-center space-y-6 border-2 p-16 rounded-2xl">
      <h2 className="text-3xl">Profile</h2>
      <div className="flex space-x-6 items-center justify-around w-128">
        <label className="text-xl">Payday</label>
        <input
          type="date"
          value={formData.payday}
          onChange={(e) => handleChange("payday", e.target.value)}
          className="p-4"
        />
      </div>
      <div className="flex space-x-6 items-center justify-around  w-128">
        <label className="text-xl">Currency</label>
        <select
          value={formData.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
          className="p-4"
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>
  );
};

export default FirstLogin;
