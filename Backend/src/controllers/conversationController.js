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

exports.startFriendConversation = async (req, res) => {
   const { friendId } = req.body;
   const userId = req.user.userId;

   const existingConversation = await prisma.conversation.findFirst({
      where: {
         AND: [
            { isGroup: false },
            { members: { some: { id: userId } } },
            { members: { some: { id: friendId } } },
         ],
      },
   });

   if (existingConversation) {
      res.json(existingConversation);
   } else {
      const friendConversation = await prisma.conversation.create({
         data: {
            isGroup: false,
            members: {
               connect: [{ id: userId }, { id: friendId }],
            },
         },
      });
      res.json(friendConversation);
   }
};

exports.getUserConversations = async (req, res) => {
   try {
      const userId = req.user.userId;

      const conversations = await prisma.conversation.findMany({
         where: {
            members: {
               some: { id: userId },
            },
         },
         include: {
            members: {
               select: { id: true, username: true, status: true },
            },
            messages: {
               orderBy: { timestamp: 'desc' },
               take: 1,
            },
         },
      });

      const privateConversations = conversations.filter((c) => !c.isGroup);
      const groupConversations = conversations.filter((c) => c.isGroup);

      res.json({ privateConversations, groupConversations });
   } catch (error) {
      res.status(500).json({ error: 'Error fetching conversations.' });
   }
};

exports.deleteConversation = async (req, res) => {
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
};

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
