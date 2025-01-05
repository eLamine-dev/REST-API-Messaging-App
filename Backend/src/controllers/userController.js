const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
   const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
   });
   res.json(user);
};

exports.updateStatus = async (req, res) => {
   const { status } = req.body;
   const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { status },
   });
   res.json(user);
};
