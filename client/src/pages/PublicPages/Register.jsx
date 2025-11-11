import React from "react";
import { publicImages } from "../../assets/data/images.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

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
      setError("Please fill in all fields");
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    } else if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    } else {
      // code to send formData to your backend
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Registration successful!");
          navigate("/login");
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
      } finally {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }); // Reset form data after submission
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
    <div className="flex items-center justify-center min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row items-center justify-center bg-white shadow-2xl w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Image Section - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={publicImages[1].source}
            alt="registerimg"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-5 sm:p-6 lg:p-8 xl:p-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
            PlanWise: Where your vision pays off.
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Create your account to get started
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form
            className="flex flex-col space-y-3 sm:space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                required
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                required
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                required
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                required
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-2.5 sm:p-3 rounded-lg font-semibold text-sm hover:bg-green-400 hover:border-green-400 border border-black transition-all duration-300 shadow-lg hover:shadow-green-400/50"
            >
              Register
            </button>

            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-500 hover:text-green-600 font-semibold transition-colors"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
