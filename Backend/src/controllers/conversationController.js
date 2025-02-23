const prisma = require("../utils/prismaClient");

exports.createConversation = async (req, res) => {
  const { name, isGroup } = req.body;
  try {
    const conversation = await prisma.conversation.create({
      data: {
        name,
        isGroup,
        adminId: isGroup ? req.user.userId : null,
        members: {
          connect: { id: req.user.userId },
        },
      },
      include: {
        members: { select: { id: true, username: true, status: true } },
      },
    });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error creating conversation." });
  }
};

exports.getConversationMessages = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching messages for conversation ID:", id);

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.json(conversation);
  } catch (error) {
    console.log("Error fetching conversation messages:", error);
    res.status(500).json({ error: "Error fetching messages." });
  }
};

exports.getChatRoom = async (req, res) => {
  try {
    const chatRoom = await prisma.conversation.findFirst({
      where: { isChatRoom: true },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
          take: 30,
        },
        members: {
          select: { id: true, username: true, status: true },
        },
      },
    });

    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found." });
    }

    res.json(chatRoom);
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

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;

    const groups = await prisma.conversation.findMany({
      where: {
        isGroup: true,
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

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching groups." });
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

    await prisma.message.deleteMany({
      where: {
        conversationId: parseInt(groupId),
      },
    });

    await prisma.conversation.delete({
      where: { id: parseInt(groupId) },
    });

    res.json({ message: "Group deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting group." });
  }
};

exports.addMember = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
      include: { members: true },
    });

    // if (!group || !group.isGroup || group.adminId !== req.user.userId) {
    //   return res.status(403).json({ error: "Only the admin can add members." });
    // }

    // if (group.members.some((member) => member.id === parseInt(userId))) {
    //   return res.status(400).json({ error: "User is already a member." });
    // }

    const response = await prisma.conversation.update({
      where: { id: parseInt(groupId) },
      data: { members: { connect: { id: parseInt(userId) } } },
      include: { members: true },
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error adding member." });
  }
};

exports.removeMember = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

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
      data: { members: { disconnect: { id: userId } } },
    });

    res.json({ message: "Member removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error removing member." });
  }
};

exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group || !group.isGroup) {
      return res.status(404).json({ error: "Group not found." });
    }

    await prisma.conversation.update({
      where: { id: parseInt(groupId) },
      data: { members: { disconnect: { id: parseInt(req.user.userId) } } },
    });

    res.json({ message: "Left group successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error leaving group." });
  }
};

exports.renameGroup = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;
  try {
    const group = await prisma.conversation.findUnique({
      where: { id: parseInt(groupId) },
    });
    if (!group || !group.isGroup || group.adminId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Only the admin can rename this group." });
    }
    const updatedGroup = await prisma.conversation.update({
      where: { id: parseInt(groupId) },
      data: { name },
    });
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: "Error renaming group." });
  }
};

exports.searchGroups = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await prisma.conversation.findMany({
      where: {
        isGroup: true,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        members: {
          select: { id: true, username: true, status: true },
        },
      },
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error searching groups." });
  }
};

exports.getConversation = async (req, res) => {
  const { id } = req.id;
  try {
    const response = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },

      include: {
        members: {
          select: { id: true, username: true, status: true },
        },
      },
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error searching groups." });
  }
};
