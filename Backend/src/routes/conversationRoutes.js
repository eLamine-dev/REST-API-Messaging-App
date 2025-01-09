const express = require('express');
const {
   createConversation,
   getConversation,
   deleteConversation,
} = require('../controllers/conversationController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, createConversation);
router.get('/:id', authenticateJWT, getConversation);
router.post('/:id', authenticateJWT, deleteConversation);

module.exports = router;
