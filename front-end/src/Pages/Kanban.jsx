import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTasks, updateTask } from "../Services/Operations/taskActions";
import TaskCard from "../Components/TaskCard";
import CreateTaskModal from "../Components/CreateTaskModal";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Kanban = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((state) => state.task);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  const columns = [
    { key: "todo", label: "To Do" },
    { key: "in-progress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    dispatch(updateTask(draggableId, { status: newStatus }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Kanban Board</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          + Add Task
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 p-4  rounded-lg shadow-sm min-h-75"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-700 ">
                      {col.label}
                    </h3>

                    {tasks
                      .filter((task) => task.status === col.key)
                      .map((task, index) => (
                        <Draggable
                          draggableId={task._id}
                          index={index}
                          key={task._id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="transition-transform"
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      {open && (
        <CreateTaskModal projectId={projectId} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default Kanban;
