const router = require("express").Router();

const { auth } = require("../Middleware/AuthMiddleware");
const { getMessages } = require("../Controllers/Chat");

router.get("/messages", auth, getMessages);


module.exports = router;

