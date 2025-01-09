const express = require('express');
const {
   sendFriendRequest,
   acceptFriendRequest,
} = require('../controllers/friendController');

const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, sendFriendRequest);
router.post('/accept', authenticateJWT, acceptFriendRequest);

module.exports = router;
