const express = require('express');
const {
   sendMessage,
   getMessages,
} = require('../controllers/messageController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, sendMessage);
router.get('/', authenticateJWT, getMessages);

module.exports = router;
