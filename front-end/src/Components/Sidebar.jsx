import React from "react";
import { NavLink, useParams } from "react-router-dom";

const Sidebar = () => {
  const { id } = useParams(); // Project ID if inside a project

  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {/* Projects list always visible */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-gray-700 ${
              isActive ? "bg-blue-600" : ""
            }`
          }
        >
          Projects
        </NavLink>

        {/* Project-specific tabs */}
        {id && (
          <>
            <NavLink
              to={`/dashboard/projects/${id}/kanban`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-blue-600" : ""
                }`
              }
            >
              Kanban
            </NavLink>

            <NavLink
              to={`/dashboard/projects/${id}/chat`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-blue-600" : ""
                }`
              }
            >
              Chat
            </NavLink>

            <NavLink
              to={`/dashboard/projects/${id}/team`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-blue-600" : ""
                }`
              }
            >
              Team
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
