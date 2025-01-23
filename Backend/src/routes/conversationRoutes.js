const express = require("express");
const {
  createConversation,
  getConversationMessages,
  deleteConversation,
  addMember,
  removeMember,
  startFriendConversation,
  getUserConversations,
  getChatRoomId,
} = require("../controllers/conversationController");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateJWT, createConversation);

router.get("/user", authenticateJWT, getUserConversations);
router.get("/messages/:id", authenticateJWT, getConversationMessages);
router.get("/get-chatroom", authenticateJWT, getChatRoomId);
router.post("/delete/:id", authenticateJWT, deleteConversation);
router.post("/addMember/:id", authenticateJWT, addMember);
router.post("/removeMember/:id", authenticateJWT, removeMember);
router.post(
  "/startFriendConversation",
  authenticateJWT,
  startFriendConversation
);

module.exports = router;
