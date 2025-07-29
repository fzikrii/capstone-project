
import React , {useState} from "react";
import { Link } from 'react-router-dom';
import bgwave from "../assets/bgwave.png";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  //DO NOT CHANGE, this is the only port that it works in
  const BACKEND_URL = 'http://localhost:5000';

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage(`Welcome, ${data.user.displayName}! Login successful.`);
        // Here you would typically redirect the user or update the app state
        // For example: window.location.href = '/dashboard';
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  const handleGoogleLogin = () => {
    // This redirects the user to the backend route for Google authentication
    window.location.href = `${BACKEND_URL}/auth/google/callback`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with background image */}
      <div className="w-full md:w-1/2 relative overflow-hidden bg-[#0B1C47] flex items-center justify-center p-8">
        {/* Img */}
        <div
          className="absolute inset-0 transform scale-110 z-0"
          style={{
            backgroundImage: `url(${bgwave})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Text and Animation */}
        <div className="relative z-10 text-center px-6 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to CodeName</h1>
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
          <form className="space-y-4">
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C47]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0B1C47] text-white font-semibold rounded-lg shadow-md hover:bg-[#020F31]"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img className="w-5 h-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
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
