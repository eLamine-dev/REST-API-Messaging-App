exports.createConversation = async (req, res) => {};
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
exports.addMember = async (req, res) => {};
