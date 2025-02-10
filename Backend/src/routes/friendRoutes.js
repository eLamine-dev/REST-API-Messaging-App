const express = require("express");
const {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  deleteRequest,
} = require("../controllers/friendController");

const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, getFriends);
router.get("/requests", authenticateJWT, getPendingRequests);

router.post("/", authenticateJWT, sendFriendRequest);
router.post("/accept/:requestId", authenticateJWT, acceptFriendRequest);
router.delete("/delete/:requestId", authenticateJWT, deleteRequest);

module.exports = router;
