const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);

module.exports = router;
