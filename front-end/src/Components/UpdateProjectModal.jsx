import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProject } from "../Services/Operations/projectActions";

const UpdateProjectModal = ({ onClose, currentProject }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(currentProject?.name || "");
  const [description, setDescription] = useState(currentProject?.description || "");

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name || "");
      setDescription(currentProject.description || "");
    }
  }, [currentProject]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await dispatch(updateProject(currentProject._id, { name, description }));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Update Project</h2>

        <input
          className="w-full border p-2 mb-3 rounded-md"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 cursor-pointer rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectModal;
