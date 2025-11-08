import React, { useEffect, useState, useRef } from "react";
import { Plus, X, Pencil, Trash, Target, DollarSign } from "lucide-react";
import { GrAchievement } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import EmblaCarousel from "../../components/ui/Carousel";

const Goals = () => {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAchieved, setLoadingAchieved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAllocateMoneyModalOpen, setIsAllocateMoneyModalOpen] =
    useState(false);
  const [walletAmount, setWalletAmount] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);
  const swiperRef = useRef(null);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);
  const [goalWalletBalance, setGoalWalletBalance] = useState(0);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [remainingMoney, setRemainingMoney] = useState(null);
  const [specificGoalAmount, setSpecificGoalAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const [newGoal, setNewGoal] = useState({
    name: "",
    amount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: "",
    priority: "Low",
  });

  useEffect(() => {
    fetchGoals();
    fetchAchievedGoals();
    getRemainingMoney();
    fetchGoalWalletBalance();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch goals");

      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievedGoals = async () => {
    setLoadingAchieved(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/goals/achieved", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch achieved goals");

      const data = await res.json();
      setAchievedGoals(data);
    } catch (err) {
      console.error("Error fetching achieved goals:", err);
    } finally {
      setLoadingAchieved(false);
    }
  };

  const fetchGoalWalletBalance = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/goals/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch wallet");

      setGoalWalletBalance(data.balance);
    } catch (e) {
      setGoalWalletBalance(0);
      console.error("Error fetching goal wallet balance:", e);
    }
  };

  const getRemainingMoney = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/income-expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRemainingMoney(data.totalIncome - data.totalExpenses);
      } else {
        console.error(
          "Error fetching remaining money:",
          data.message || data.error
        );
      }
    } catch (error) {
      console.error("Error fetching remaining money:", error);
    }
  };

  const handleGoalWallet = async () => {
    setSavingWallet(true);
    if (walletAmount > remainingMoney) {
      setSavingWallet(false);
      alert("Amount exceeds remaining balance");
      return;
    }
    if (!walletAmount || isNaN(walletAmount) || walletAmount <= 0) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/goals/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(walletAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error adding to wallet");

      setGoalWalletBalance(data.wallet.balance);
      setRemainingMoney((prev) => prev - Number(walletAmount));
      setIsWalletModalOpen(false);
      console.log("Added to Goals Wallet!");
    } catch (err) {
      console.error(err.message);
    } finally {
      setSavingWallet(false);
      setWalletAmount("");
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.amount || !newGoal.endDate) {
      alert("Please fill in all required fields");
      // resetForm();
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      let res, data;
      if (editingGoalId) {
        console.log("Editing goal ID:", editingGoalId);
        res = await fetch(`http://localhost:5000/api/goals/${editingGoalId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newGoal),
        });
      } else {
        res = await fetch("http://localhost:5000/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newGoal),
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error adding goal");

      setIsAddGoalModalOpen(false);
      resetForm();
      setEditingGoalId(null);
      if (editingGoalId) {
        setGoals((prev) =>
          prev.map((g) => (g._id === data.goal._id ? data.goal : g))
        );
      } else {
        setGoals((prev) => [...prev, data.goal]);
      }
      console.log(data.message);
    } catch (err) {
      console.error("Error adding or saving goal:", err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditGoal = (goal) => {
    console.log("Editing goal:", goal._id);
    setNewGoal({
      name: goal.name,
      amount: goal.amount,
      startDate: goal.startDate.split("T")[0],
      endDate: goal.endDate.split("T")[0],
      description: goal.description,
      priority: goal.priority,
    });
    setEditingGoalId(goal._id);
    setIsAddGoalModalOpen(true);
  };

  const handleDeleteGoal = async (goalId) => {
    setDeletingGoalId(goalId);
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error deleting goal");
        setGoals((prev) => prev.filter((goal) => goal._id !== goalId));
        setGoalWalletBalance(data.wallet.balance);
        setDeletingGoalId(null);
      } catch (err) {
        console.error("Error deleting goal:", err);
        setDeletingGoalId(null);
        alert(err.message);
      }
    }, 1000);
  };

  const handleAllocateMoney = async (e) => {
    e.preventDefault();
    if (
      !specificGoalAmount ||
      isNaN(specificGoalAmount) ||
      specificGoalAmount <= 0
    ) {
      alert("Please enter a valid amount");
      return;
    }
    if (specificGoalAmount > goalWalletBalance) {
      alert("Amount exceeds goal wallet balance");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/goals/${selectedGoalId}/allocate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(specificGoalAmount),
            goalId: selectedGoalId,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error allocating money");
      setGoals((prev) =>
        prev.map((g) =>
          g._id === selectedGoalId
            ? { ...g, allocated: data.goal.allocated }
            : g
        )
      );
      setGoalWalletBalance(data.wallet.balance);
      setIsAllocateMoneyModalOpen(false);
      setSpecificGoalAmount("");
      setSelectedGoalId(null);
      console.log("Money allocated to goal successfully!");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  const handleAchieveGoal = async (goalId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/goals/${goalId}/achieve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error achieving goal");

      setGoals((prev) => prev.filter((goal) => goal._id !== goalId));
      fetchAchievedGoals(); // Refresh achieved goals list
      console.log("Goal achieved successfully!");
    } catch (err) {
      console.error("Error achieving goal:", err);
      alert(err.message);
    }
  };

  const resetForm = () => {
    setNewGoal({
      name: "",
      amount: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      description: "",
      priority: "Low",
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Ongoing";
    const date = new Date(dateStr);
    return isNaN(date)
      ? "Ongoing"
      : date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-6">
        {/* Title and Add Goal Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Goals
            </h1>
          </div>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Remaining Money Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Remaining Balance
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{remainingMoney !== null ? remainingMoney.toLocaleString("en-IN") : "0"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Available for allocation
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Goal Wallet Balance
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{goalWalletBalance.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ready to allocate to goals
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-200 hover:from-green-600 hover:to-emerald-700"
                  aria-label="Add to Goal Wallet"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Display */}
      <div className="flex items-center space-x-2 p-8">
        {loading ? (
          <p>Loading goals...</p>
        ) : goals.length === 0 ? (
          <p>No goals found.</p>
        ) : (
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveSwiperIndex(swiper.activeIndex)}
            initialSlide={activeSwiperIndex}
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            className="w-full h-full"
          >
            {Array.isArray(goals) &&
              goals.map((goal) => (
                <SwiperSlide
                  key={goal._id}
                  className={`flex justify-center items-center ${
                    deletingGoalId === goal._id
                      ? "opacity-0 transition-opacity duration-1000"
                      : ""
                  }`}
                >
                  <div className="relative w-full h-full rounded-2xl border-pink-500 border-2  shadow-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_40%)]" />
                    <div className="relative z-10 p-5 h-full  grid grid-cols-2 gap-4">
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/25 text-white uppercase tracking-wide">
                              {goal.priority}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                goal.status === "Active"
                                  ? "bg-emerald-400/30 text-white"
                                  : "bg-white/25 text-white"
                              }`}
                            >
                              {goal.status}
                            </span>
                          </div>
                          <h3 className="text-white text-xl font-bold leading-snug line-clamp-2">
                            {goal.name}
                          </h3>
                          <p className="text-white/80 text-xs mt-1 line-clamp-2">
                            {goal.description}
                          </p>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-white">
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="text-[10px] opacity-80">Target</div>
                            <div className="font-semibold">₹{goal.amount}</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="text-[10px] opacity-80">
                              Allocated
                            </div>
                            <div className="font-semibold">
                              ₹{goal.allocated}
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2 col-span-2">
                            <div className="text-[10px] opacity-80">
                              Timeline
                            </div>
                            <div className="text-xs">
                              {formatDate(goal.startDate)} →{" "}
                              {formatDate(goal.endDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            className="px-4 py-2 rounded-lg text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                            onClick={() => handleEditGoal(goal)}
                          >
                            <Pencil size={16} /> Edit
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg text-white bg-red-500/80 hover:bg-red-600/90 backdrop-blur-sm transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                            onClick={() => handleDeleteGoal(goal._id)}
                          >
                            <Trash size={16} /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-between">
                        <div className="w-28 h-28">
                          <CircularProgressbar
                            value={(goal.allocated / goal.amount) * 100}
                            text={`${Math.round(
                              (goal.allocated / goal.amount) * 100
                            )}%`}
                            styles={buildStyles({
                              pathColor: "#22c55e",
                              textColor: "#ffffff",
                              trailColor: "rgba(255,255,255,0.25)",
                              strokeLinecap: "round",
                            })}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-semibold hover:from-emerald-500 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => {
                              setIsAllocateMoneyModalOpen(true);
                              setSelectedGoalId(goal._id);
                            }}
                          >
                            Allocate
                          </button>
                          <button
                            className="px-5 py-2.5 rounded-lg bg-white/90 text-indigo-700 font-semibold hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                            onClick={() => handleAchieveGoal(goal._id)}
                          >
                            <GrAchievement size={18} /> Achieve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>

      {/* Achieved Goals Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white flex items-center justify-center shadow">
            <GrAchievement className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Achieved Goals</h2>
        </div>
        {loadingAchieved ? (
          <p className="text-gray-500">Loading achieved goals...</p>
        ) : achievedGoals.length === 0 ? (
          <p className="text-gray-500">
            No achieved goals yet. Keep working towards your goals!
          </p>
        ) : (
          <EmblaCarousel
            slides={achievedGoals}
            options={{
              align: "start",
              loop: false,
              slidesToScroll: 1,
            }}
            renderSlide={(goal) => (
              <div className="relative rounded-2xl border-2 border-yellow-400 shadow-lg bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-5 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_40%)]" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-white/30 text-white uppercase tracking-wide">
                      Achieved
                    </span>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-white/30 text-white">
                      {goal.priority}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                    {goal.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 line-clamp-2">
                    {goal.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/20 rounded-lg p-2">
                      <div className="text-[10px] text-white/80">Target</div>
                      <div className="font-semibold text-white">
                        ₹{goal.amount}
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2">
                      <div className="text-[10px] text-white/80">Allocated</div>
                      <div className="font-semibold text-white">
                        ₹{goal.allocated}
                      </div>
                    </div>
                  </div>
                  {goal.achievedAt && (
                    <div className="text-white/90 text-xs">
                      Achieved on: {formatDate(goal.achievedAt)}
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        )}
      </div>

      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add to Goal Wallet</h2>
              <X
                onClick={() => setIsWalletModalOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleGoalWallet();
              }}
            >
              <div>
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={walletAmount}
                  min={1}
                  max={remainingMoney}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={savingWallet}
                className={`w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                  savingWallet ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {savingWallet ? "Saving..." : "Add to Wallet"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add Goal</h2>
              <X
                onClick={() => {
                  setIsAddGoalModalOpen(false);
                  setEditingGoalId(null);
                  resetForm();
                }}
                className="cursor-pointer"
              />
            </div>

            <form className="space-y-4" onSubmit={handleAddGoal}>
              <div>
                <label className="block text-gray-700">Goal Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">Goal Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={newGoal.amount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">Goal Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={newGoal.startDate}
                  disabled
                />
              </div>

              <div>
                <label className="block text-gray-700">Goal End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={newGoal.endDate}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, endDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">Priority</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newGoal.priority}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving
                  ? "Saving..."
                  : editingGoalId
                  ? "Update Goal"
                  : "Add Goal"}
              </button>
            </form>
          </div>
        </div>
      )}
      {isAllocateMoneyModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Allocate Money to Goal</h2>
              <X
                onClick={() => {
                  setIsAllocateMoneyModalOpen(false);
                  setSpecificGoalAmount("");
                }}
                className="cursor-pointer"
              />
            </div>
            <form className="space-y-4" onSubmit={handleAllocateMoney}>
              <div>
                <div className="flex justify-between">
                  <label className="block text-gray-700">Amount</label>
                  <div className="text-sm text-gray-500 mb-1">
                    (Max: ₹{goalWalletBalance})
                  </div>
                </div>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={specificGoalAmount}
                  min={1}
                  max={goalWalletBalance}
                  onChange={(e) => setSpecificGoalAmount(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                Allocate Money
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
