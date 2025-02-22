const prisma = require("../utils/prismaClient");

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        status: true,
        bio: true,
        profilePic: true,
        sentFriendships: {
          include: {
            receiver: { select: { id: true, username: true, status: true } },
          },
        },
        receivedFriendships: {
          include: {
            sender: { select: { id: true, username: true, status: true } },
          },
        },
        conversations: {
          include: {
            members: { select: { id: true, username: true, status: true } },
            messages: { orderBy: { timestamp: "desc" }, take: 1 },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const acceptedRequests = [
      ...user.sentFriendships.filter((f) => f.status === "ACCEPTED"),
      ...user.receivedFriendships.filter((f) => f.status === "ACCEPTED"),
    ];

    const pendingRequests = {
      sent: user.sentFriendships.filter((f) => f.status === "PENDING") || [],
      received:
        user.receivedFriendships.filter((f) => f.status === "PENDING") || [],
    };

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.status,
      bio: user.bio,
      profilePic: user.profilePic,
      acceptedRequests,
      pendingRequests,
      conversations: user.conversations,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
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

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: parseInt(userId) },
          { senderId: parseInt(userId), receiverId: req.user.userId },
        ],
      },
    });

    user.friendship = friendship;

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
