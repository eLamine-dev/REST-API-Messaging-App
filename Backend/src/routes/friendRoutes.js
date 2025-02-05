const express = require("express");
const {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
} = require("../controllers/friendController");

const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, getFriends);
router.get("/requests", authenticateJWT, getPendingRequests);
router.post("/", authenticateJWT, sendFriendRequest);
router.post("/accept", authenticateJWT, acceptFriendRequest);

module.exports = router;
