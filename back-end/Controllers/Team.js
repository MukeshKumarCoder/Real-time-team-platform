const Team = require("../Models/Team");
const User = require("../Models/User");

// create a Team
exports.createTeam = async (req, res) => {
  try {
    const { name, description, projectId } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Name and ProjectId are required",
      });
    }

    const team = await Team.create({
      name,
      description,
      project: projectId,
      adminId: req.user.id,
      members: [req.user.id],
    });

    await User.findByIdAndUpdate(req.user.id, {
      teamId: team._id,
      role: "ADMIN",
    });

    return res.status(200).json({
      success: true,
      message: "Team created Successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create a Team",
    });
  }
};

// Get all teams of a project
exports.getAllTeamsOfProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const teams = await Team.find({ project: projectId })
      .populate("adminId", "name email")
      .populate("members", "name email");

    return res.status(200).json({
      success: true,
      message: "Teams fetched successfully",
      teams, // <-- IMPORTANT (array)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};

// Get Team Details
exports.getTeamDetails = async (req, res) => {
  try {
    // const teamId = req.params.id;
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId)
      .populate("adminId", "name email")
      .populate("members", "name email")
      .populate("project", "name");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team Got Successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to find Team Details",
      error: error.message,
    });
  }
};

// update team
exports.updateTeam = async (req, res) => {
  try {
    // get team id from params
    const { id } = req.params;

    // validate team id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    // update team
    const team = await Team.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Team cannot be updated. Please try again",
    });
  }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
  try {
    // get team id from Params
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // delete team
    await Team.findByIdAndDelete(id);

    // remove team reference from users
    await User.updateMany({ teamId: id }, { $unset: { teamId: "", role: "" } });

    // return response
    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Team cannot be deleted.",
    });
  }
};

// Add member to team
exports.addMember = async (req, res) => {
  try {
    // Get Data from req body
    const teamId = req.params.id;
    const { userId } = req.body;

    const team = await Team.findById(teamId);

    if (!team)
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });

    // Admin cannot be added as a member
    if (team.adminId.toString() === userId) {
      return res.status(400).json({ message: "Admin already in team" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already in team",
      });
    }

    team.members.push(userId);
    await team.save();

    // Update user
    user.teamId = teamId;
    user.role = "MEMBER";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      memberId: userId,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add member" });
  }
};

// Remove member from team
exports.removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const team = await Team.findById(id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    team.members.pull(req.params.memberId);
    await team.save();

    await User.findByIdAndUpdate(memberId, {
      $unset: { teamId: "" },
    });

    return res.status(200).json({
      success: true,
      message: "Member removed Successfully",
      memberId: req.params.memberId,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to remove member" });
  }
};

