import React from "react";
import img from "../assets/regimg.png";
import { useState } from "react";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.name.trim() ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    } else if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    } else if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    } else if (!formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    } else {
      // code to send formData to your backend
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Registration successful!");
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center  bg-white shadow-lg w-3/4 rounded-3xl">
        <img src={img} alt="registerimg" className="w-1/2 rounded-l-3xl " />
        <div className="w-1/2 flex flex-col  px-14 space-y-5">
          <h1 className="text-2xl font-bold">
            PlanWise: Where your vision pays off.
          </h1>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              Create your account!
            </label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              required
              className="p-4"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              required
              className="p-4"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              required
              className="p-4"
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              required
              className="p-4"
              onChange={handleChange}
            />
            <button type="submit" className="border p-4">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
