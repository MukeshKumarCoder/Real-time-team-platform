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
  isManager,
  isMember,
} = require("../Middleware/AuthMiddleware");

router.get("/", auth, getAllTasks);
router.post("/create", auth, isAdmin, isManager, createTask);
router.put("/update/:id", auth, updateTask);
router.delete("/delete/:id", auth, isAdmin);

module.exports = router;
