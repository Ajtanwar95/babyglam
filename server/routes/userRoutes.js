const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const upload = require("../middlewares/upload");

const router = express.Router();

// Register User
router.post("/register", upload.single("profileImage"), registerUser);
router.post("./login", loginUser);

module.exports = router;
