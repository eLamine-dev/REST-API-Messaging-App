const express = require('express');
const {
   sendFriendRequest,
   acceptFriendRequest,
} = require('../controllers/friendController');

const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, sendFriendRequest);
router.get('/:id', authenticateJWT, acceptFriendRequest);

module.exports = router;
