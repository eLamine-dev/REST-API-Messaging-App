const prisma = require('../utils/prismaClient');

exports.sendMessage = async (req, res) => {
   const { receiverId, groupId, content } = req.body;
   const message = await prisma.message.create({
      data: {
         content,
         senderId: req.user.userId,
         receiverId,
         groupId,
      },
   });
   res.json(message);
};

exports.getPrivateConversation = async (req, res) => {
   const { id } = req.params;
   const messages = await prisma.message.findMany({
      where: {
         privateConversationId: parseInt(id),
      },
      orderBy: {
         timestamp: 'asc',
      },
   });
   res.json(messages);
};

exports.getGroupConversation = async (req, res) => {
   const { id } = req.params;
   const messages = await prisma.message.findMany({
      where: {
         groupConversationId: parseInt(id),
      },
      orderBy: {
         timestamp: 'asc',
      },
   });
   res.json(messages);
};
