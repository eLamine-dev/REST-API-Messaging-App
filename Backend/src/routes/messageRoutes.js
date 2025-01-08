const express = require('express');
const {
   sendMessage,

   getGroupConversation,
   getPrivateConversation,
} = require('../controllers/messageController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, sendMessage);
router.get('/private/:id', authenticateJWT, getPrivateConversation);
router.get('/group/:id', authenticateJWT, getGroupConversation);

module.exports = router;
