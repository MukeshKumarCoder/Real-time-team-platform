import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteTeam } from "../Services/Operations/teamActions";

const TeamCard = ({ team, projectId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-md transition flex-1">
      <div>
        <h3 className="font-semibold text-lg mb-1">{team.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {" "}
          {team.description || "No description provided"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() =>
            navigate(`/dashboard/projects/${projectId}/team/${team._id}`)
          }
          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded cursor-pointer text-sm transition-colors"
        >
          Open
        </button>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => dispatch(deleteTeam(projectId, team._id))}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 cursor-pointer rounded text-sm transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
