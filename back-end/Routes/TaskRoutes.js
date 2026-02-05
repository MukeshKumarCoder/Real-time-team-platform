const router = require("express").Router();

const {
  createTask,
  updateTask,
  getAllTasks,
  deleteTask,
} = require("../Controllers/Task");

const {
  auth,
  isAdmin,
  isAdminOrManager,
} = require("../Middleware/AuthMiddleware");

router.get("/", auth, getAllTasks);
router.post("/create", auth, isAdminOrManager, createTask);
router.put("/update/:id", auth, updateTask);
router.delete("/delete/:id", auth, isAdmin, deleteTask);

module.exports = router;

