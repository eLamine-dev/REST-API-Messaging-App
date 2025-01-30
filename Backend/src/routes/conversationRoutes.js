const express = require("express");
const {
  createConversation,
  getConversationMessages,
  deleteConversation,
  addMember,
  removeMember,
  getFriendConversation,
  getUserConversations,
  getChatRoomId,
  createGroup,
  leaveGroup,
  deleteGroup,
} = require("../controllers/conversationController");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateJWT, createConversation);

router.get("/user", authenticateJWT, getUserConversations);
router.get("/messages/:id", authenticateJWT, getConversationMessages);
router.get("/get-chatroom", authenticateJWT, getChatRoomId);
router.post("/delete/:id", authenticateJWT, deleteConversation);

router.post("/create-group", authenticateJWT, createGroup);
router.post("/add-member", authenticateJWT, addMember);
router.post("/remove-member", authenticateJWT, removeMember);
router.post("/leave-group", authenticateJWT, leaveGroup);
router.delete("/delete-group/:groupId", authenticateJWT, deleteGroup);
router.get(
  "/getFriendConversation/:friendId",
  authenticateJWT,
  getFriendConversation
);

module.exports = router;
