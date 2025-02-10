const express = require("express");
const {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  deleteFriendship,
} = require("../controllers/friendController");

const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, getFriends);
router.get("/requests", authenticateJWT, getPendingRequests);

router.post("/", authenticateJWT, sendFriendRequest);
router.post("/accept", authenticateJWT, acceptFriendRequest);
router.delete("/", authenticateJWT, deleteFriendship);

module.exports = router;
