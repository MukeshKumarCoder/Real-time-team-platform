const router = require("express").Router();

const {
  createProject,
  updateProject,
  getProject,
  deleteProject,
  getSingleProject,
} = require("../Controllers/Project");

const {
  auth,
  isAdmin,
  isManager,
  isMember,
} = require("../Middleware/AuthMiddleware");

router.post("/create", auth, isAdmin, isManager, createProject);
router.put("/update/:id", auth, isAdmin, isManager, updateProject);
router.get("/", auth, isAdmin, isManager, isMember, getProject);
router.get("/single/:id", auth, isAdmin, isManager, isMember, getSingleProject);
router.delete("/delete/:id", auth, isAdmin, deleteProject);

module.exports = router;
