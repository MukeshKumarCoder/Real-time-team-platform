import React from "react";
import { NavLink } from "react-router-dom";

const ProjectTabs = ({ projectId }) => {
  const tabs = [
    { name: "Kanban", path: `/dashboard/projects/${projectId}/kanban` },
    { name: "Chat", path: `/dashboard/projects/${projectId}/chat` },
    { name: "Team", path: `/dashboard/projects/${projectId}/team` },
  ];

  return (
    <div className="flex space-x-6 border-b mb-4">
      {tabs.map((tab) => (
        <NavLink
          key={tab.name}
          to={tab.path}
          className={({ isActive }) =>
            `pb-2 font-medium ${
              isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
};

export default ProjectTabs;
