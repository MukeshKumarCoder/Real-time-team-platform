import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import ProjectDetails from "./Pages/ProjectDetails";
import Kanban from "./Pages/Kanban";
import Chat from "./Pages/Chat";
import Team from "./Pages/Team";
import TeamDetails from "./Pages/TeamDetails";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Projects />} />

          <Route path="projects/:projectId" element={<ProjectDetails />}>
            <Route index element={<Kanban />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="chat" element={<Chat />} />

            <Route path="team" element={<Team />} />
            <Route path="team/:teamId" element={<TeamDetails />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
