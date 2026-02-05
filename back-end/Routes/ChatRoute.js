const router = require("express").Router();

const { auth } = require("../Middleware/AuthMiddleware");
const { getMessages, sendMessage } = require("../Controllers/Chat");

router.get("/messages", auth, getMessages);
router.post("/messages", auth, sendMessage);

module.exports = router;
