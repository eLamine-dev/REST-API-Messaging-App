const express = require("express");
const {
  getProfile,
  updateStatus,
  searchUsers,
} = require("../controllers/userController");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", authenticateJWT, getProfile);
router.get("/search", authenticateJWT, searchUsers);
router.patch("/profile", authenticateJWT, getProfile);
router.patch("/status", authenticateJWT, updateStatus);

module.exports = router;
