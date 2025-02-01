const express = require("express");
const {
  updateStatus,
  searchUsers,
  getUserDetails,
} = require("../controllers/userController");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:userId", authenticateJWT, getUserDetails);
router.get("/search", authenticateJWT, searchUsers);

router.patch("/status", authenticateJWT, updateStatus);

module.exports = router;
