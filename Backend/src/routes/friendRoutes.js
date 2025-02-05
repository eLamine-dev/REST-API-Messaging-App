const express = require('express');
const {
<<<<<<< Updated upstream
   getFriends,
   sendFriendRequest,
   acceptFriendRequest,
} = require('../controllers/friendController');
=======
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
} = require("../controllers/friendController");
>>>>>>> Stashed changes

const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

<<<<<<< Updated upstream
router.get('/', authenticateJWT, getFriends);
router.post('/', authenticateJWT, sendFriendRequest);
router.post('/accept', authenticateJWT, acceptFriendRequest);
=======
router.get("/", authenticateJWT, getFriends);
router.get("/requests", authenticateJWT, getPendingRequests);
router.post("/", authenticateJWT, sendFriendRequest);
router.post("/accept", authenticateJWT, acceptFriendRequest);
>>>>>>> Stashed changes

module.exports = router;
