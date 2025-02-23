const express = require("express");
const {
  createConversation,
  getConversationMessages,
  deleteConversation,
  addMember,
  removeMember,
  getFriendConversation,
  getUserConversations,
  getChatRoom,
  getUserGroups,
  leaveGroup,
  deleteGroup,
  renameGroup,
  searchGroups,
  getConversation,
} = require("../controllers/conversationController");

const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateJWT, createConversation);
router.get("/:id", authenticateJWT, getConversation);
router.get("/search", authenticateJWT, searchGroups);
router.get("/user", authenticateJWT, getUserConversations);
router.get("/user-groups", authenticateJWT, getUserGroups);
router.get("/messages/:id", authenticateJWT, getConversationMessages);
router.get("/chatroom", authenticateJWT, getChatRoom);
router.post("/delete/:id", authenticateJWT, deleteConversation);
router.put("/rename/:groupId", authenticateJWT, renameGroup);
router.post("/members/:groupId", authenticateJWT, addMember);
router.post("/members/remove/:groupId", authenticateJWT, removeMember);
router.post("/leave/:groupId", authenticateJWT, leaveGroup);
router.delete("/delete-group/:groupId", authenticateJWT, deleteGroup);
router.get(
  "/getFriendConversation/:friendId",
  authenticateJWT,
  getFriendConversation
);

module.exports = router;
