const router = require("express").Router();

const {
  createTask,
  updateTask,
  getAllTasks,
  assignTask,
  deleteTask,
} = require("../Controllers/Task");

const {
  auth,
  isAdmin,
  isAdminOrManager,
} = require("../Middleware/AuthMiddleware");

router.get("/", auth, getAllTasks);
router.post("/create", auth, isAdminOrManager, createTask);
router.put("/:id/status", auth, updateTask);
router.put("/:id/assign",auth, isAdminOrManager, assignTask);
router.delete("/delete/:id", auth, isAdmin, deleteTask);

module.exports = router;
