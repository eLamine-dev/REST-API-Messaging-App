exports.sendFriendRequest = async (req, res) => {
   const { receiverId } = req.body;
   try {
      const request = await prisma.friendship.create({
         data: {
            senderId: req.user.userId,
            receiverId,
            status: 'PENDING',
         },
      });
      res.json(request);
   } catch (error) {
      res.status(500).json({ error: 'Error sending friend request.' });
   }
};

exports.acceptFriendRequest = async (req, res) => {
   const { id } = req.params;
   try {
      const updatedRequest = await prisma.friendship.update({
         where: { id: parseInt(id) },
         data: { status: 'ACCEPTED' },
      });
      res.json(updatedRequest);
   } catch (error) {
      res.status(500).json({ error: 'Error accepting friend request.' });
   }
};

exports.rejectFriendRequest = async (req, res) => {
   const { id } = req.params;
   try {
      await prisma.friendship.update({
         where: { id: parseInt(id) },
         data: { status: 'REJECTED' },
      });
      res.json({ message: 'Friend request rejected.' });
   } catch (error) {
      res.status(500).json({ error: 'Error rejecting friend request.' });
   }
};
