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
} = require("../Controllers/Team");

router.post("/create", auth, isAdmin, createTeam);

router.get("/:id", auth, getTeamDetails);

router.put("/:id", auth, isAdmin, updateTeam);

router.delete("/:id", auth, isAdmin, deleteTeam);

router.post("/:id/members", auth, isAdminOrManager, addMember);


router.delete("/:id/members/:memberId", auth, isAdminOrManager, removeMember);

router.get("/users/all", auth, getTeamUsers);

module.exports = router;


