import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Outlet } from "react-router-dom";
import { fetchSingleProject } from "../redux/projectSlice";
import ProjectTabs from "../Components/ProjectTabs";

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchSingleProject(id));
  }, [dispatch, id]);

  if (loading || !currentProject)
    return <p className="text-center text-gray-500 mt-6">Loading project...</p>;

  return (
    <div>
      <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
        <h1 className="text-2xl font-bold">{currentProject.name}</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {currentProject.description}
        </p>
      </div>

      {/* Tabs */}
      <ProjectTabs projectId={id} />

      {/* Nested tab content */}
      <div className="space-y-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectDetails;
