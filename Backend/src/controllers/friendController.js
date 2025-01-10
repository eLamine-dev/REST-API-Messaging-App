const prisma = require('../utils/prismaClient');

exports.getFriends = async (req, res) => {
   const userId = req.user.userId;

   try {
      const friendships = await prisma.friendship.findMany({
         where: {
            status: 'ACCEPTED',
            OR: [{ senderId: userId }, { receiverId: userId }],
         },
         include: {
            sender: { select: { id: true, username: true, status: true } },
            receiver: { select: { id: true, username: true, status: true } },
         },
      });

      const friends = friendships.map((f) =>
         f.senderId === userId ? f.receiver : f.sender
      );

      res.json(friends);
   } catch (error) {
      res.status(500).json({ error: 'Error retrieving friends.' });
   }
};

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

exports.ignoreRequest = async (req, res) => {
   const { id } = req.params;
   try {
      await prisma.friendship.delete({
         where: { id: parseInt(id) },
      });
      res.json({ message: 'Friend request deleted.' });
   } catch (error) {
      res.status(500).json({ error: 'Error rejecting friend request.' });
   }
};
