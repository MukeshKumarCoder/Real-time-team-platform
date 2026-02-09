import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamsOfProject } from "../Services/Operations/teamActions";
import { useParams, Outlet } from "react-router-dom";
import CreateTeamModal from "../Components/CreateTeamModal";
import TeamCard from "../Components/TeamCard";

const Team = () => {
  const [open, setOpen] = useState(false);
  const { team, loading } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { projectId } = useParams();

  useEffect(() => {
    dispatch(fetchTeamsOfProject(projectId));
  }, [dispatch, projectId]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Team</h1>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            Create Team
          </button>
        )}
      </div>

      {!loading && (!team || team.length === 0) && (
        <p className="text-center text-gray-500 mt-6">
          No Teams yet. Create one
        </p>
      )}

      {team && team.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((t) => (
            <TeamCard key={t._id} team={t} projectId={projectId} />
          ))}
        </div>
      )}

      <div className="space-y-6">
        <Outlet />
      </div>

      {open && (
        <CreateTeamModal onClose={() => setOpen(false)} projectId={projectId} />
      )}
    </div>
  );
};

export default Team;
