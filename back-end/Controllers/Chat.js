const Chat = require("../Models/Chat");

exports.getMessages = async (req, res) => {
  const { projectId, teamId } = req.query;
  try {
    const filter = {};
    if (projectId) filter.projectId = projectId;
    if (teamId) filter.teamId = teamId;

    const messages = await Chat.find(filter)
      .populate("sender", "name email role")
      .sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, projectId, teamId } = req.body;
  try {
    const message = await Chat.create({
      content,
      sender: req.user._id,
      projectId,
      teamId,
    });
    const populated = await message.populate("sender", "name email role");
    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};
