const prisma = require("../utils/prismaClient");

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
    res.status(500).json({ error: "Error creating conversation." });
  }
};

exports.getConversationMessages = async (req, res) => {
  const { id } = req.params;
  console.log("params id", id);

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    res.json(conversation.messages);
  } catch (error) {
    console.log("error getting conversation messages", error);
  }
};

exports.getChatRoomId = async (req, res) => {
  try {
    const chatRoom = await prisma.conversation.findFirst({
      where: { isChatRoom: true },
    });

    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found." });
    }

    res.json(chatRoom.id);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getFriendConversation = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user.userId;
  console.log(userId, friendId);

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { isGroup: false },
        { members: { some: { id: parseInt(userId) } } },
        { members: { some: { id: parseInt(friendId) } } },
      ],
    },
  });

  if (existingConversation) {
    res.json(existingConversation);
  } else {
    const newfriendConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        members: {
          connect: [{ id: userId }, { id: friendId }],
        },
      },
    });
    res.json(newfriendConversation);
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
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    const privateConversations = conversations.filter((c) => !c.isGroup);
    const groupConversations = conversations.filter((c) => c.isGroup);

    res.json({ privateConversations, groupConversations });
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversations." });
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
      message: "Conversation and related messages deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting conversation." });
  }
};

exports.createGroup = async (req, res) => {
  const { name, memberIds } = req.body;
  try {
    const group = await prisma.conversation.create({
      data: {
        name,
        isGroup: true,
        adminId: req.user.userId,
        members: {
          connect: [
            ...memberIds.map((id) => ({ id })),
            { id: req.user.userId },
          ], // Add creator to members
        },
      },
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Error creating group." });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group || !group.isGroup || group.adminId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Only the admin can delete this group." });
    }

    await prisma.conversation.delete({
      where: { id: parseInt(groupId) },
    });

    res.json({ message: "Group deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting group." });
  }
};

exports.addMember = async (req, res) => {
  const { groupId, memberId } = req.body;
  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group || !group.isGroup || group.adminId !== req.user.userId) {
      return res.status(403).json({ error: "Only the admin can add members." });
    }

    await prisma.conversation.update({
      where: { id: parseInt(groupId) },
      data: { members: { connect: { id: memberId } } },
    });

    res.json({ message: "Member added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error adding member." });
  }
};

exports.removeMember = async (req, res) => {
  const { groupId, memberId } = req.body;
  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group || !group.isGroup || group.adminId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Only the admin can remove members." });
    }

    await prisma.conversation.update({
      where: { id: parseInt(groupId) },
      data: { members: { disconnect: { id: memberId } } },
    });

    res.json({ message: "Member removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error removing member." });
  }
};

exports.leaveGroup = async (req, res) => {
  const { groupId } = req.body;
  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group || !group.isGroup) {
      return res.status(404).json({ error: "Group not found." });
    }

    await prisma.conversation.update({
      where: { id: parseInt(groupId) },
      data: { members: { disconnect: { id: req.user.userId } } },
    });

    res.json({ message: "Left group successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error leaving group." });
  }
};
