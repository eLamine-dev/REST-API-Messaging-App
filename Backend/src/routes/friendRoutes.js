const express = require("express");
const {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
} = require("../controllers/friendController");

const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, getFriends);
router.post("/", authenticateJWT, sendFriendRequest);
router.post("/accept", authenticateJWT, acceptFriendRequest);

module.exports = router;
