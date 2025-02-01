const prisma = require("../utils/prismaClient");

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile." });
  }
};

exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;
  console.log("geting user details", userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    const isFriend = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: parseInt(userId) },
          { senderId: parseInt(userId), receiverId: req.user.userId },
        ],
        status: "ACCEPTED",
      },
    });
    if (isFriend) {
      user.isFriend = true;
    } else {
      user.isFriend = false;
    }
    console.log(user);

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user." });
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
    res.status(500).json({ error: "Error updating status." });
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
    res.status(500).json({ error: "Error updating profile." });
  }
};

exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error searching for users." });
  }
};
