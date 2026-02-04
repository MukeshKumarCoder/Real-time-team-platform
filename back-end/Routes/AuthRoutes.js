const router = require("express").Router();

const { signup, login } = require("../Controllers/Auth");

router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
