import React from "react";
//import { useNavigate } from "react-router-dom";
import img from "../../assets/loginimg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    } else if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    } else {
      setError("");
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Handle successful login
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        login(data.user);

        if (!data.user.monthlyIncome) {
          navigate("/firstlogin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Login failed");
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="flex items-center justify-center bg-white  shadow-lg w-2/3 rounded-3xl">
        <img src={img} alt="loginimg" className="w-1/2 rounded-l-3xl " />
        <div className="w-1/2 flex flex-col  justify-center pt-10 px-10">
          <h1 className="text-3xl font-bold mb-6 ">Welcome Back!</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form
            className="space-y-4 flex flex-col max-w-2xs"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm font-medium text-gray-700">
              Enter your Details
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-4"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-4"
            />
            <label className="flex items-center  space-x-2">
              <input type="checkbox" />
              <p>Remember me</p>
            </label>
            <button type="submit" className="w-full border p-4">
              Login
            </button>
            <p className="text-sm text-gray-500">
              Don't have an account?
              <a href="/register" className="text-blue-500">
                {" "}
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
