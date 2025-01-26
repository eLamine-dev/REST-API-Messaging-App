const prisma = require("../utils/prismaClient");

exports.sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const senderId = req.user.userId;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        conversation: parseInt(conversationId),
      },
    });

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.message.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Error deleting message." });
  }
};
