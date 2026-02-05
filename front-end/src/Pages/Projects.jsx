import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/projectSlice";
import ProjectCard from "../Components/ProjectCard";
import CreateProjectModal from "../Components/CreateProjectModal";

const Projects = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>

        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            + New Project
          </button>
        )}
      </div>

      {loading && <p className="text-center text-gray-500 mt-6">Loading...</p>}

      {!loading && list.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No projects yet. Create one 
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {open && <CreateProjectModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Projects;
