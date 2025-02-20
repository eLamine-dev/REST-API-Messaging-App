const express = require("express");
const {
  updateStatus,
  searchUsers,
  getUserDetails,
  getProfile,
} = require("../controllers/userController");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", authenticateJWT, getProfile);
router.get("/search", authenticateJWT, searchUsers);
router.get("/:userId", authenticateJWT, getUserDetails);

router.patch("/status", authenticateJWT, updateStatus);

module.exports = router;
