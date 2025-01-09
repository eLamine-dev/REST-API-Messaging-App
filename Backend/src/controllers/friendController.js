exports.sendFriendRequest = async (req, res) => {
   const { userId } = req.body;
   try {
      const request = await prisma.friendship.create({
         data: { user1Id: req.user.userId, user2Id: userId, status: 'pending' },
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
         data: { status: 'accepted' },
      });
      res.json(updatedRequest);
   } catch (error) {
      res.status(500).json({ error: 'Error accepting friend request.' });
   }
};
