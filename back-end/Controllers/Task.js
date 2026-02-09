const Task = require("../Models/Task");
const Project = require("../Models/Project");
const User = require("../Models/User");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../Validations/taskValidation");

// Create Task
exports.createTask = async (req, res) => {
  try {
    // Data from req body
    let { title, description, status, projectId, assignedTo } = req.body;
    const createdBy = req.user.id;

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
      createdBy,
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
    const { status } = req.body;
    

    // validate
    const { error } = updateTaskSchema.validate({ status });
    if (error) {
      return res.status(400).json({
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

    // update task
    task.status = status;
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

// Assign the task to a member
exports.assignTask = async (req, res) => {
  try {
    // get data from req body
    const { userId } = req.body;

    // validate user id
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // check user exists or not
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // assign task to user
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true },
    ).populate("assignedTo", "name email");

    // check task exists or not
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Task cannot be assigned. Please try again",
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
