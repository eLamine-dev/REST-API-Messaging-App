const express = require("express");
const { getProfile, updateStatus } = require("../controllers/userController");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", authenticateJWT, getProfile);
router.patch("/profile", authenticateJWT, getProfile);
router.patch("/status", authenticateJWT, updateStatus);

module.exports = router;
