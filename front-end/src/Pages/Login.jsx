import React, { useState } from "react";
import api from "../Services/apiConnector";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { ACCOUNT_TYPE } from "../Utils/Constant";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: ACCOUNT_TYPE.MEMBER,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = currentState === "Login" ? "/auth/login" : "/auth/signup";
    try {
      const payload =
        currentState === "Login"
          ? {
              email: userData.email,
              password: userData.password,
            }
          : userData;

      const res = await api.post(url, payload);

      if (currentState === "Login") {
        const user = res.data.user;
        const token = res.data.token;

        dispatch(login({ user, token }));
        toast.success("Login Successfully");
        navigate("/dashboard");
      } else {
        toast.success("Registration Successful ! Please Login");
        setCurrentState("Login");
      }

      setUserData({
        name: "",
        email: "",
        password: "",
        role: ACCOUNT_TYPE.MEMBER,
      });
    } catch (error) {
      console.log("error", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{currentState}</h1>

        <form onSubmit={handleSubmit}>
          {currentState === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                required
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              />

              <select
                value={userData.role}
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              >
                <option value={ACCOUNT_TYPE.MEMBER}>Member</option>
                <option value={ACCOUNT_TYPE.MANAGER}>Manager</option>
                <option value={ACCOUNT_TYPE.ADMIN}>Admin</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            required
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="w-full p-2 border rounded mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            required
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors"

          >
            {currentState === "Login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          {currentState === "Login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setCurrentState("Sign Up")}
                className="text-blue-600 cursor-pointer"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setCurrentState("Login")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
