const prisma = require('../utils/prismaClient');

exports.sendMessage = async (req, res) => {
   const { receiverId, groupId, content } = req.body;
   const message = await prisma.message.create({
      data: {
         conversationId,
         content,
         senderId: req.user.userId,
         receiverId,
      },
   });
   res.json(message);
};

exports.deleteMessage = async (req, res) => {
   const { id } = req.params;
   try {
      await prisma.message.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Message deleted successfully.' });
   } catch (error) {
      res.status(500).json({ error: 'Error deleting message.' });
   }
};
