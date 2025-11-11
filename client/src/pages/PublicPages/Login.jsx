import React from "react";
//import { useNavigate } from "react-router-dom";
import { publicImages } from "../../assets/data/images.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { API_BASE_URL } from "../../api";
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

        const isFirstLogin = !data.user.isSetupComplete;

        if (isFirstLogin) {
          navigate("/app/firstlogin");
        } else {
          navigate("/app/dashboard");
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
    <div className="flex items-center justify-center min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row items-center justify-center bg-white shadow-2xl w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Image Section - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={publicImages[0].source}
            alt="loginimg"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-5 sm:p-6 lg:p-8 xl:p-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Enter your details to continue
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form
            className="space-y-3 sm:space-y-4 flex flex-col"
            onSubmit={handleSubmit}
          >
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                required
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-400 border-gray-300 rounded focus:ring-green-400"
                />
                <span className="text-xs sm:text-sm text-gray-700">
                  Remember me
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-2.5 sm:p-3 rounded-lg font-semibold text-sm hover:bg-green-400 hover:border-green-400 border border-black transition-all duration-300 shadow-lg hover:shadow-green-400/50"
            >
              Login
            </button>

            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-green-500 hover:text-green-600 font-semibold transition-colors"
              >
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
