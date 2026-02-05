const Project = require("../Models/Project");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../Validations/ProjectValidation");

// Create Project
exports.createProject = async (req, res) => {
  try {
    // data from req body
    const { name, description } = req.body;

    // validate
    const { error } = createProjectSchema.validate({ name, description });
    if (error) {
      return res.status(403).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // create project
    const project = await Project.create({
      name,
      description,
      teamId: req.user.teamId,
    });

    // return res
    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    // console.log("error", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// update project
exports.updateProject = async (req, res) => {
  try {
    // data from req body
    const { name, description } = req.body;

    // validate
    const { error } = updateProjectSchema.validate({ name, description });
    if (error) {
      return res.status(403).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // update project
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, teamId: req.user.teamId },
      { name, description },
      { new: true },
    );

    // check project exist or not
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // return res
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Project cannot be updated. Please try again",
    });
  }
};

// delete project
exports.deleteProject = async (req, res) => {
  try {
    // get project id from params
    const projectId = req.params.id;

    // delete project
    const project = await Project.findOneAndDelete({
      _id: projectId,
      teamId: req.user.teamId,
    });

    // check project exist or not
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // return res
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Project cannot be deleted. Please try again",
    });
  }
};

// Get all Project
exports.getProject = async (req, res) => {
  try {
    const projects = await Project.find({
      teamId: req.user.teamId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: projects,
      message: "Projects received successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
      error: error.message,
    });
  }
};

// Get Single Project
exports.getSingleProject = async (req, res) => {
  try {
    // get project id from params
    const projectId = req.params.id;

    // find project by id and team
    const project = await Project.findOne({
      _id: projectId,
      teamId: req.user.teamId,
    });

    // check project exist or not
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // return res
    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project. Please try again",
    });
  }
};
