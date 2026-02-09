const router = require("express").Router();
const {
  auth,
  isAdminOrManager,
  isAdmin,
} = require("../Middleware/AuthMiddleware");
const {
  createTeam,
  getTeamDetails,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  getTeamUsers,
  getAllTeamsOfProject,
} = require("../Controllers/Team");


router.post("/create", auth, isAdmin, createTeam);

router.get("/project/:projectId", auth, getAllTeamsOfProject);

router.get("/:teamId", auth, getTeamDetails);

router.put("/:id", auth, isAdmin, updateTeam);

router.delete("/:id", auth, isAdmin, deleteTeam);

router.post("/:id/members", auth, isAdminOrManager, addMember);

router.delete("/:id/members/:memberId", auth, isAdminOrManager, removeMember);

module.exports = router;
