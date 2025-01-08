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
   const conversation = await prisma.privateConversation.findUnique({
      where: {
         id: parseInt(id),
      },
      include: {
         messages: {
            orderBy: {
               timestamp: 'asc',
            },
         },
      },
   });
   res.json(conversation.messages);
};

exports.getGroupConversation = async (req, res) => {
   const { id } = req.params;
   const conversation = await prisma.groupConversation.findUnique({
      where: {
         id: parseInt(id),
      },
      include: {
         messages: {
            orderBy: {
               timestamp: 'asc',
            },
         },
      },
   });
};
