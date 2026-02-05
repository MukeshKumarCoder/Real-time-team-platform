import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Real-time Team Collaboration
        </h1>
        <p className="text-gray-600 mb-6">
          Manage projects, tasks, and chat — all in one place.
        </p>
        <Link
          to={token ? "/dashboard" : "/login"}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {token ?"Go to DashBoard" : "Get Started"}
        </Link>
      </div>
    </div>
  );
};

export default Home;
