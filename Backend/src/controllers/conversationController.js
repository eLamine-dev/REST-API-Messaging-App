exports.createConversation = async (req, res) => {
   const { name, isGroup, memberIds } = req.body;
   try {
      const conversation = await prisma.conversation.create({
         data: {
            name,
            isGroup,
            adminId: req.user.userId,
            members: { connect: memberIds.map((id) => ({ id })) },
         },
      });
      res.json(conversation);
   } catch (error) {
      res.status(500).json({ error: 'Error creating conversation.' });
   }
};
exports.getConversation = async (req, res) => {
   const { id } = req.params;
   const conversation = await prisma.Conversation.findUnique({
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

exports.deleteConversation = async (req, res) => {};
const { id } = req.params;
try {
   await prisma.message.deleteMany({
      where: {
         conversationId: parseInt(id),
      },
   });
   await prisma.conversation.delete({
      where: {
         id: parseInt(id),
      },
   });
   res.json({
      message: 'Conversation and related messages deleted successfully.',
   });
} catch (error) {
   res.status(500).json({ error: 'Error deleting conversation.' });
}

exports.addMember = async (req, res) => {
   const { conversationId, memberId } = req.body;
   try {
      await prisma.conversation.update({
         where: { id: conversationId },
         data: { members: { connect: { id: memberId } } },
      });
      res.json({ message: 'Member added successfully.' });
   } catch (error) {
      res.status(500).json({ error: 'Error adding member.' });
   }
};

exports.disconnectMember = async (req, res) => {
   const { conversationId, memberId } = req.body;
   try {
      await prisma.conversation.update({
         where: { id: conversationId },
         data: { members: { disconnect: { id: memberId } } },
      });
      res.json({ message: 'Member removed successfully.' });
   } catch (error) {
      res.status(500).json({ error: 'Error removing member.' });
   }
};
