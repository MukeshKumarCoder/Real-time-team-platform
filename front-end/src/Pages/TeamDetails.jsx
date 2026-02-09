import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchTeamDetails,
  addMember,
  removeMember,
} from "../Services/Operations/teamActions";
import { clearTeam } from "../redux/teamSlice";
import UpdateTeamModal from "../Components/UpdateTeamModal";

const TeamDetails = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { currentTeam, loading } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const { teamId } = useParams();

  // Handlers for members
  const handleAddMember = (userId) => {
    if (userId) {
      dispatch(addMember(teamId, userId));
    }
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      dispatch(removeMember(teamId, memberId));
    }
  };

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId));
    }

    return () => {
      dispatch(clearTeam());
    };
  }, [dispatch, teamId]);

  if (loading || !currentTeam || currentTeam._id !== teamId) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {user?.name} ({user?.role})'s Team
      </h1>
      <div className="bg-white flex justify-between rounded-lg p-6 mb-8 shadow hover:shadow-md transition">
        <div>
          <h1 className="text-2xl font-bold">{currentTeam.name}</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {currentTeam.description}
          </p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer h-fit"
          >
            Edit Team
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
            {currentTeam.members?.length || 0} Members
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {currentTeam.members && currentTeam.members.length > 0 ? (
            currentTeam.members.map((member) => (
              <div
                key={member._id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {member._id === currentTeam.adminId?._id && (
                    <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                      Team Lead
                    </span>
                  )}

                  {/* Remove Action: Only show if user is Admin/Manager AND it's not their own row */}
                  {(user?.role === "ADMIN" || user?.role === "MANAGER") &&
                    member._id !== user._id && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-tight transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No members found in this team.
            </div>
          )}
        </div>
      </div>

      {open && (
        <UpdateTeamModal
          onClose={() => setOpen(false)}
          currentTeam={currentTeam}
        />
      )}
    </div>
  );
};

export default TeamDetails;
