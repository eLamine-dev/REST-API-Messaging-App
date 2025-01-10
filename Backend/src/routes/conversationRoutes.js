const express = require('express');
const {
   createConversation,
   getConversation,
   deleteConversation,
   addMember,
   removeMember,
   startFriendConversation,
   getUserConversations,
} = require('../controllers/conversationController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, createConversation);
router.get('/:id', authenticateJWT, getConversation);
router.get(
   '/startFriendConversation',
   authenticateJWT,
   startFriendConversation
);
router.get('/user', authenticateJWT, getUserConversations);
router.post('/delete/:id', authenticateJWT, deleteConversation);
router.post('/addMember/:id', authenticateJWT, addMember);
router.post('/removeMember/:id', authenticateJWT, removeMember);

module.exports = router;
