const router = require("express").Router();
const { auth, isAdminOrManager } = require("../Middleware/AuthMiddleware");
const {
  getTeamMembers,
  addMember,
  removeMember,
  getAllUsers,
} = require("../Controllers/Team");

router.get("/:id/members", auth, getTeamMembers);
router.post("/:id/members", auth, isAdminOrManager, addMember);
router.delete("/:id/members/:memberId", auth, isAdminOrManager, removeMember);
router.get("/users/all", auth, getAllUsers); 

module.exports = router;
