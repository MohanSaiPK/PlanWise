import { Currency } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FirstLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobIncome: "",
    investmentIncome: "",
    sideIncome: "",
    needsRatio: "",
    wantsRatio: "",
    savingsRatio: "",
    payday: "",
    currency: "INR",
    avatar: "",
    savingsGoal: "",
    financialGoals: [],
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // console.log(formData.jobIncome, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/user/setup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        navigate("/dashboard");
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
  return (
    <div className="flex flex-col space-y-6 border-2 p-16 rounded-2xl">
      <h2 className="text-3xl">Your Monthly Income Sources</h2>
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
  return (
    <div className="flex flex-col space-y-6 border-2 p-16 rounded-2xl">
      <h2 className="text-3xl">Budget Allocation</h2>
      <div className="flex space-x-6 items-center  justify-around w-80">
        <label className="text-xl">Needs</label>
        <input
          type="number"
          value={formData.needsRatio}
          onChange={(e) => handleChange("needsRatio", e.target.value)}
          className="p-4"
        />
      </div>
      <div className="flex space-x-6 items-center  justify-around w-80">
        <label className="text-xl">Wants</label>
        <input
          type="number"
          value={formData.wantsRatio}
          onChange={(e) => handleChange("wantsRatio", e.target.value)}
          className="p-4"
        />
      </div>
      <div className="flex space-x-6 items-center  justify-around w-80">
        <label className="text-xl">Savings</label>
        <input
          type="number"
          value={formData.savingsRatio}
          onChange={(e) => handleChange("savingsRatio", e.target.value)}
          className="p-4"
        />
      </div>
    </div>
  );
};

const Step3Profile = ({ formData, handleChange }) => {
  return (
    <div className="flex flex-col justify-between items-center space-y-6 border-2 p-16 rounded-2xl">
      <h2 className="text-3xl">Profile & Goals</h2>
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
      <div className="flex space-x-6 items-center justify-around  w-128">
        <label className="text-xl">Monthly Saving Goal</label>
        <input
          type="number"
          value={formData.savingsGoal}
          onChange={(e) => handleChange("savingsGoal", e.target.value)}
          className="p-4"
        />
      </div>
    </div>
  );
};

export default FirstLogin;
