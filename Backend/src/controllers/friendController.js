const prisma = require("../utils/prismaClient");

exports.getFriends = async (req, res) => {
  const userId = req.user.userId;
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
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
    res.status(500).json({ error: "Error retrieving friends." });
  }
};

exports.sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.userId;

  try {
    const existingRequest = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already exists." });
    }

    const request = await prisma.friendship.create({
      data: { senderId, receiverId, status: "PENDING" },
    });

    const fullRequest = await prisma.friendship.findUnique({
      where: { id: request.id },
      include: {
        sender: { select: { id: true, username: true, status: true } },
        receiver: { select: { id: true, username: true, status: true } },
      },
    });

    res.json(fullRequest);
  } catch (error) {
    res.status(500).json({ error: "Error sending friend request." });
  }
};

exports.getPendingRequests = async (req, res) => {
  const userId = req.user.userId;
  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: { status: "PENDING" },
      include: {
        sender: { select: { id: true, username: true, status: true } },
        receiver: { select: { id: true, username: true, status: true } },
      },
    });

    const sent = pendingRequests.filter((f) => f.senderId === userId);
    const received = pendingRequests.filter((f) => f.receiverId === userId);

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving pending requests." });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRequest = await prisma.friendship.update({
      where: { id: parseInt(id) },
      data: { status: "ACCEPTED" },
      include: {
        sender: { select: { id: true, username: true, status: true } },
        receiver: { select: { id: true, username: true, status: true } },
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: "Error accepting friend request." });
  }
};

exports.deleteRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const friendship = await prisma.friendship.findUnique({
      where: { id: parseInt(requestId) },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found." });
    }

    await prisma.friendship.delete({
      where: { id: parseInt(requestId) },
    });

    res.json({ message: "Friendship deleted." });
  } catch (error) {
    console.error("Error deleting friendship:", error);
    res.status(500).json({ error: "Error deleting friendship." });
  }
};
