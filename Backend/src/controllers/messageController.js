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

exports.getMessages = async (req, res) => {
   const messages = await prisma.message.findMany({
      where: {
         OR: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
      },
   });
   res.json(messages);
};
