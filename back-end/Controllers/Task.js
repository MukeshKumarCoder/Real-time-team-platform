const Task = require("../Models/Task");
const Project = require("../Models/Project");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../Validations/taskValidation");

// Create Task
exports.createTask = async (req, res) => {
  try {
    // Data from req body
    let { title, description, status, projectId, assignedTo } = req.body;

    // validate
    const { error } = createTaskSchema.validate({
      title,
      description,
      projectId,
      assignedTo,
    });

    status = status || "todo";

    if (error) {
      return res.status(403).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // create Task
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      status,
    });

    // return res
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Task cannot be created. Please try again",
    });
  }
};

// update Task
exports.updateTask = async (req, res) => {
  try {
    // data from req body
    const updateData = req.body;

    // validate
    const { error } = updateTaskSchema.validate(updateData);
    if (error) {
      return res.status(403).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // find task and check team access
    const task = await Task.findById(req.params.id).populate({
      path: "projectId",
      match: { teamId: req.user.teamId },
    });

    // check task exist or not
    if (!task || !task.projectId) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // MEMBER restriction
    if (
      req.user.role === "MEMBER" &&
      (updateData.assignedTo || updateData.title)
    ) {
      return res.status(403).json({
        success: false,
        message: "Members can only update task status",
      });
    }

    // update task
    Object.assign(task, updateData);
    await task.save();

    // return res
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Task cannot be updated. Please try again",
    });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    // get project id from query
    const { projectId } = req.query;

    // validate
    if (!projectId) {
      return res.status(403).json({
        success: false,
        message: "Project id is required",
      });
    }

    // check project exist or not
    const project = await Project.findOne({
      _id: projectId,
      teamId: req.user.teamId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // get tasks of project
    const tasks = await Task.find({ projectId }).populate(
      "assignedTo",
      "name email",
    );

    // return res
    return res.status(200).json({
      success: true,
      message: "Successfully got all tasks",
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again",
    });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    // get task id from params
    const taskId = req.params.id;

    // find task and check team access
    const task = await Task.findById(taskId).populate({
      path: "projectId",
      match: { teamId: req.user.teamId },
    });

    // check task exist or not
    if (!task || !task.projectId) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // delete task
    await task.deleteOne();

    // return res
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Task cannot be deleted. Please try again",
    });
  }
};
