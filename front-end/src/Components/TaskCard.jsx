import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../Services/Operations/taskActions";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white p-4 mb-3 rounded shadow hover:shadow-md transform transition-all space-y-2">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-gray-500 text-sm">{task.description}</p>

      <div className="flex justify-end">
        {user?.role === "ADMIN" && (
          <button
            onClick={() => dispatch(deleteTask(task._id))}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 cursor-pointer rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
