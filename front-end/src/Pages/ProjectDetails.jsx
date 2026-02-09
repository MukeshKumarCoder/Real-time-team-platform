import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Outlet } from "react-router-dom";
import ProjectTabs from "../Components/ProjectTabs";
import { fetchSingleProject } from "../Services/Operations/projectActions";
import UpdateProjectModal from "../Components/UpdateProjectModal";

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { currentProject, loading } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(fetchSingleProject(projectId));
  }, [dispatch, projectId]);

  if (loading || !currentProject) return <div className="spinner"></div>;

  return (
    <div>
      <div className="bg-white flex justify-between rounded-lg p-6 mb-8 shadow hover:shadow-md transition">
        <div>
          {" "}
          <h1 className="text-2xl font-bold">{currentProject.name}</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {currentProject.description}
          </p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            Edit Project
          </button>
        )}
      </div>

      {/* Tabs */}
      <ProjectTabs projectId={projectId} />

      {/* Nested tab content */}
      <div className="space-y-6">
        <Outlet />
      </div>
      {open && (
        <UpdateProjectModal
          onClose={() => setOpen(false)}
          currentProject={currentProject}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
