const express = require('express');
const { sendMessage } = require('../controllers/messageController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, sendMessage);

module.exports = router;
