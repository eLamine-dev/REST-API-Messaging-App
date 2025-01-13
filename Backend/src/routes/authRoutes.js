const express = require('express');
const {
   register,
   login,
   logout,
   validateToken,
} = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);
router.get('/validate-token', authenticateJWT, validateToken);

module.exports = router;
