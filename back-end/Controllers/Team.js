const Team = require("../Models/Team");
const User = require("../Models/User");

// Get team members
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "name email role",
    );

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    return res.status(200).json({ success: true, members: team.members });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch members" });
  }
};

// Add member to team
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    if (team.members.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    return res
      .status(200)
      .json({ success: true, message: "Member added", memberId: userId });
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
    const team = await Team.findById(req.params.id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    team.members.pull(req.params.memberId);
    await team.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Member removed",
        memberId: req.params.memberId,
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to remove member" });
  }
};

// Get all users (for adding to team)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};
