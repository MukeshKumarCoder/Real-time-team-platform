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
  isAdminOrManager,
} = require("../Middleware/AuthMiddleware");

router.get("/", auth, getProject);
router.post("/create", auth, isAdminOrManager, createProject);
router.put("/update/:id", auth, isAdminOrManager, updateProject);
router.get("/:id", auth, getSingleProject);
router.delete("/delete/:id", auth, isAdmin, deleteProject);

module.exports = router;
