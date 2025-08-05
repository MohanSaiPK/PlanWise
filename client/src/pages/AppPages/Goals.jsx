import React, { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.amount || !newGoal.endDate) {
      alert("Please fill in all required fields");
      resetForm();
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error adding goal");

      setIsModalOpen(false);
      resetForm();
      fetchGoals();
    } catch (err) {
      console.error("Error adding goal:", err);
      alert(err.message);
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Goals</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus /> <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Display */}
      <div className="flex items-center space-x-2 p-8">
        {loading ? (
          <p>Loading goals...</p>
        ) : goals.length === 0 ? (
          <p>No goals found.</p>
        ) : (
          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            className="w-full h-64"
          >
            {goals.map((goal, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div className="border-2 p-4 w-full h-full rounded-lg shadow bg-amber-300">
                  <p className="font-semibold">{goal.name}</p>
                  <p>₹{goal.amount}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(goal.startDate)} → {formatDate(goal.endDate)}
                  </p>
                  <p>{goal.description}</p>
                  <div className="bg-gray-400 inline-block px-2 py-1 rounded text-white text-xs">
                    {goal.priority}
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                      <Pencil /> <span>Edit</span>
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700">
                      <Trash /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add Goal</h2>
              <X
                onClick={() => setIsModalOpen(false)}
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
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, startDate: e.target.value })
                  }
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
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
                  saving && "opacity-50 cursor-not-allowed"
                }`}
              >
                {saving ? "Saving..." : "Add Goal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
