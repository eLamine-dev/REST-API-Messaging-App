const prisma = require('../utils/prismaClient');

exports.getProfile = async (req, res) => {
   try {
      const user = await prisma.user.findUnique({
         where: { id: req.user.userId },
      });
      res.json(user);
   } catch (error) {
      res.status(500).json({ error: 'Error fetching profile.' });
   }
};

exports.updateStatus = async (req, res) => {
   const { status } = req.body;
   try {
      const user = await prisma.user.update({
         where: { id: req.user.userId },
         data: { status },
      });
      res.json(user);
   } catch (error) {
      res.status(500).json({ error: 'Error updating status.' });
   }
};

exports.updateProfile = async (req, res) => {
   const { bio, profilePic, username } = req.body;

   try {
      const user = await prisma.user.update({
         where: { id: req.user.userId },
         data: { bio, profilePic, username },
      });
      res.json(user);
   } catch (error) {
      res.status(500).json({ error: 'Error updating profile.' });
   }
};
