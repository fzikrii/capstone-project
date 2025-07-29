import React from "react";
import { Link } from "react-router-dom";
import Bgteamwork from "../assets/bgteamwork.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#0B1C47] text-white px-6 py-4 shadow-md">
        <div className="w-full flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">CodeName</h1>
          <ul className="flex space-x-6">
            <li>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Image */}
      <header
        className="w-full h-[500px] relative bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${Bgteamwork})`,
          backgroundSize: "50% 80%", 
        }}
      ></header>

      {/* Text Section (moved below image) */}
      <section className="bg-white py-3 px-6 text-center">
        <h2 className="text-5xl font-extrabold text-[#0B1C47] mb-3">
          Empower Your Productivity
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          CodeName helps you track tasks, build achievements, and showcase your
          skills through real action.
        </p>
      </section>

      {/* Uses Section */}
      <section className="bg-white py-9 px-6 text-center mb-12">
        <h3 className="text-3xl font-bold text-[#0B1C47] mb-9">
          Why Choose CodeName?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 max-w-6xl mx-auto">
          <div className="bg-[#EAF7FF] p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Structured Task Flow</h4>
            <p className="text-gray-600">
              Manage your tasks with organized steps, progress tracking, and
              visual boards.
            </p>
          </div>
          <div className="bg-[#EAF7FF] p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Proof of Achievement</h4>
            <p className="text-gray-600">
              Every completed task becomes a credential you can show to others.
            </p>
          </div>
          <div className="bg-[#EAF7FF] p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">Team Collaboration</h4>
            <p className="text-gray-600">
              Work with teammates or mentors to build your journey together.
            </p>
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="bg-gradient-to-b from-blue-100 to-white py-16 px-6 text-center">
        <h3 className="text-3xl font-bold text-[#0B1C47] mb-6">Our Mission</h3>
        <p className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed">
          We believe that productivity should be meaningful. CodeName is built
          to help students, professionals, and dreamers turn ideas into reality
          with clear progress, collaboration, and recognized achievements.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1C47] text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} CodeName. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
