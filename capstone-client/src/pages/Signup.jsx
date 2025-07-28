import React from "react";
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side for simple animation */}
      <div className="w-full md:w-1/2 bg-[#0B1C47] text-white flex flex-col items-center justify-center p-8">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Join CodeName</h1>
          <p className="text-sky-300 max-w-md mx-auto">
            Create your account and unlock opportunities, achievements, and skill development.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <span className="w-4 h-4 bg-sky-400 rounded-full animate-ping"></span>
            <span className="w-4 h-4 bg-sky-300 rounded-full animate-pulse"></span>
            <span className="w-4 h-4 bg-sky-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>

      {/* Right side for signup form */}
      <div className="w-full md:w-1/2 bg-[#EAF7FF] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-[#0B1C47] text-center mb-6">
            Create an Account
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#0B1C47]"
              >
                Username
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 w-full px-4 py-2 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C47]"
                placeholder="Your Name"
                required
              />
            </div>
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
                className="mt-1 w-full px-4 py-2 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C47]"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C47]"
                placeholder="Create a strong password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0B1C47] text-white font-semibold rounded-lg shadow-md hover:bg-[#020F31]"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-[#0B1C47]">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-500 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
