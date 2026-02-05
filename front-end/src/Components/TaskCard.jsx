import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, updateTask } from "../redux/taskSlice";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleStatusChange = (e) => {
    dispatch(
      updateTask({ id: task._id, updateData: { status: e.target.value } }),
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transform transition-all space-y-2">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-gray-500 text-sm">{task.description}</p>

      <div className="flex justify-between items-center space-x-2">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

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
