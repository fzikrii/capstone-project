import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgwave from "../assets/bgwave.png";

const Login = () => {
  const navigate = useNavigate(); // Inisialisasi navigate
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Destructure for conveniencef
  const { email, password } = formData;

  // Backend URL
  const BACKEND_URL = "http://localhost:5000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`${name} changed:`, value);
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setMessage("");

    // Debug log to check values
    console.log("Form Data:", formData);
    console.log("Destructured values:", { email, password });

    if (!formData.email || !formData.password) {
      setMessage("Please enter both email and password");
      return;
    }

    try {
      console.log("Attempting login with:", {
        email: formData.email,
        passwordLength: formData.password.length,
        passwordFirstChar: formData.password[0],
        passwordLastChar: formData.password[formData.password.length - 1],
      });

      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // This is important for handling cookies
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json().catch(() => null);
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("Login successful:", responseData);
        setMessage(
          `Welcome, ${responseData.user.displayName}! Login successful.`
        );
        localStorage.setItem("userId", responseData.user._id);
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
        navigate("/dashboard");
      } else {
        const errorMessage =
          responseData?.message ||
          "Login failed. Please check your credentials.";
        setMessage(errorMessage);
        console.error("Login failed:", {
          status: response.status,
          message: errorMessage,
          response: responseData,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  const handleGoogleLogin = () => {
    // Arahkan ke rute backend untuk otentikasi Google
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="w-full md:w-1/2 relative overflow-hidden bg-[#0B1C47] flex items-center justify-center p-8">
        <div
          className="absolute inset-0 transform scale-110 z-0"
          style={{
            backgroundImage: `url(${bgwave})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-6 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Eagle.Eye</h1>
          <div className="mt-8 flex justify-center space-x-4">
            <span className="w-4 h-4 bg-sky-400 rounded-full animate-ping"></span>
            <span className="w-4 h-4 bg-sky-300 rounded-full animate-pulse"></span>
            <span className="w-4 h-4 bg-sky-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>

      {/* Right side for login form */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-[#0B1C47] text-center mb-6">
            Login to Your Account
          </h2>

          {/* === FORM YANG DIPERBAIKI MULAI DARI SINI === */}
          <form className="space-y-4" onSubmit={handleLocalLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0B1C47]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange}
                name="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C47]"
                placeholder="you@gmail.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0B1C47]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C47]"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0B1C47] text-white font-semibold rounded-lg shadow-md hover:bg-[#020F31]"
            >
              Login
            </button>
          </form>
          {/* === FORM YANG DIPERBAIKI SELESAI DI SINI === */}

          {message && (
            <div
              className={`mt-4 text-center text-sm ${
                message.includes("Welcome") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
            <p className="mx-4 text-center font-semibold text-gray-500">OR</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img
              className="w-5 h-5 mr-3"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google icon"
            />
            Sign in with Google
          </button>

          <div className="text-center mt-6 text-sm text-[#0B1C47]">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-sky-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
