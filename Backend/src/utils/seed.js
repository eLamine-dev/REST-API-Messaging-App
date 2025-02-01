const prisma = require("./prismaClient");
const bcrypt = require("bcrypt");

async function main() {
  console.log("Seeding database...");

  // Create users
  const users = await prisma.user.createMany({
    data: [
      {
        email: "alice@example.com",
        username: "Alice",
        password: await bcrypt.hash("123", 10),
        bio: "Loves programming and coffee.",
      },
      {
        email: "bob@example.com",
        username: "Bob",
        password: await bcrypt.hash("123", 10),
        bio: "Fan of gaming and coding.",
      },
      {
        email: "charlie@example.com",
        username: "Charlie",
        password: await bcrypt.hash("123", 10),
        bio: "Enjoys traveling and photography.",
      },
      {
        email: "diana@example.com",
        username: "Diana",
        password: await bcrypt.hash("123", 10),
        bio: "Data scientist and AI enthusiast.",
      },
      {
        email: "eve@example.com",
        username: "Eve",
        password: await bcrypt.hash("123", 10),
        bio: "Cybersecurity expert.",
      },
      {
        email: "frank@example.com",
        username: "Frank",
        password: await bcrypt.hash("123", 10),
        bio: "Blockchain developer.",
      },
      {
        email: "grace@example.com",
        username: "Grace",
        password: await bcrypt.hash("123", 10),
        bio: "UI/UX designer.",
      },
      {
        email: "hank@example.com",
        username: "Hank",
        password: await bcrypt.hash("123", 10),
        bio: "DevOps engineer.",
      },
    ],
  });
  console.log(`Created ${users.count} users.`);

  // Fetch all users
  const allUsers = await prisma.user.findMany();
  const alice = allUsers.find((user) => user.email === "alice@example.com");
  const bob = allUsers.find((user) => user.email === "bob@example.com");
  const charlie = allUsers.find((user) => user.email === "charlie@example.com");
  const diana = allUsers.find((user) => user.email === "diana@example.com");
  const eve = allUsers.find((user) => user.email === "eve@example.com");
  const frank = allUsers.find((user) => user.email === "frank@example.com");
  const grace = allUsers.find((user) => user.email === "grace@example.com");
  const hank = allUsers.find((user) => user.email === "hank@example.com");

  // Create friendships
  await prisma.friendship.createMany({
    data: [
      { senderId: alice.id, receiverId: bob.id, status: "ACCEPTED" },
      { senderId: bob.id, receiverId: charlie.id, status: "PENDING" },
      { senderId: diana.id, receiverId: alice.id, status: "ACCEPTED" },
      { senderId: eve.id, receiverId: frank.id, status: "ACCEPTED" },
      { senderId: grace.id, receiverId: hank.id, status: "PENDING" },
      { senderId: hank.id, receiverId: alice.id, status: "ACCEPTED" },
      { senderId: frank.id, receiverId: diana.id, status: "PENDING" },
      { senderId: charlie.id, receiverId: eve.id, status: "ACCEPTED" },
    ],
  });
  console.log("Friendships created.");

  // Create private conversations
  const privateConversation1 = await prisma.conversation.create({
    data: {
      name: null,
      isGroup: false,
      members: { connect: [{ id: alice.id }, { id: bob.id }] },
    },
  });

  const privateConversation2 = await prisma.conversation.create({
    data: {
      name: null,
      isGroup: false,
      members: { connect: [{ id: charlie.id }, { id: diana.id }] },
    },
  });

  const privateConversation3 = await prisma.conversation.create({
    data: {
      name: null,
      isGroup: false,
      members: { connect: [{ id: eve.id }, { id: frank.id }] },
    },
  });

  console.log("Private conversations created.");

  // Create group conversations
  const groupConversation1 = await prisma.conversation.create({
    data: {
      name: "Study Group",
      isGroup: true,
      adminId: alice.id,
      members: {
        connect: [
          { id: alice.id },
          { id: charlie.id },
          { id: diana.id },
          { id: bob.id },
        ],
      },
    },
  });

  const groupConversation2 = await prisma.conversation.create({
    data: {
      name: "Tech Enthusiasts",
      isGroup: true,
      adminId: bob.id,
      members: {
        connect: [
          { id: bob.id },
          { id: eve.id },
          { id: frank.id },
          { id: grace.id },
        ],
      },
    },
  });

  console.log("Group conversations created.");

  // Create the Chat Room
  const chatRoom = await prisma.conversation.create({
    data: {
      name: "Chat Room",
      isGroup: true,
      adminId: null,
      isChatRoom: true,
      members: { connect: allUsers.map((user) => ({ id: user.id })) },
    },
  });
  console.log("Chat Room created.");

  // Add messages to private conversations
  await prisma.message.createMany({
    data: [
      {
        content: "Hi Bob, how are you?",
        senderId: alice.id,
        receiverId: bob.id,
        conversationId: privateConversation1.id,
      },
      {
        content: "Hi Alice, I am doing great! You?",
        senderId: bob.id,
        receiverId: alice.id,
        conversationId: privateConversation1.id,
      },
      {
        content: "Hey Diana, did you finish the report?",
        senderId: charlie.id,
        receiverId: diana.id,
        conversationId: privateConversation2.id,
      },
      {
        content: "Almost done, just need to review it.",
        senderId: diana.id,
        receiverId: charlie.id,
        conversationId: privateConversation2.id,
      },
      {
        content: "Frank, can you help me with the blockchain setup?",
        senderId: eve.id,
        receiverId: frank.id,
        conversationId: privateConversation3.id,
      },
      {
        content: "Sure, let's schedule a time.",
        senderId: frank.id,
        receiverId: eve.id,
        conversationId: privateConversation3.id,
      },
    ],
  });
  console.log("Messages in private conversations created.");

  // Add messages to group conversations
  await prisma.message.createMany({
    data: [
      {
        content: "Welcome to the study group!",
        senderId: alice.id,
        conversationId: groupConversation1.id,
      },
      {
        content: "Thanks Alice! Glad to be here.",
        senderId: charlie.id,
        conversationId: groupConversation1.id,
      },
      {
        content: "Looking forward to learning together!",
        senderId: diana.id,
        conversationId: groupConversation1.id,
      },
      {
        content: "Let's discuss the latest tech trends.",
        senderId: eve.id,
        conversationId: groupConversation2.id,
      },
      {
        content: "I'm particularly interested in AI advancements.",
        senderId: frank.id,
        conversationId: groupConversation2.id,
      },
      {
        content: "Same here, especially in ethical AI.",
        senderId: grace.id,
        conversationId: groupConversation2.id,
      },
    ],
  });
  console.log("Messages in group conversations created.");

  // Add messages to Chat Room
  await prisma.message.createMany({
    data: [
      {
        content: "Welcome to the Chat Room!",
        senderId: alice.id,
        conversationId: chatRoom.id,
      },
      {
        content: "Excited to connect with everyone!",
        senderId: bob.id,
        conversationId: chatRoom.id,
      },
      {
        content: "Let’s share knowledge and have fun!",
        senderId: charlie.id,
        conversationId: chatRoom.id,
      },
      {
        content: "Anyone working on blockchain projects?",
        senderId: frank.id,
        conversationId: chatRoom.id,
      },
      {
        content: "Yes, I'm currently exploring DeFi.",
        senderId: eve.id,
        conversationId: chatRoom.id,
      },
      {
        content: "That's awesome! Let's collaborate.",
        senderId: grace.id,
        conversationId: chatRoom.id,
      },
    ],
  });
  console.log("Messages in Chat Room created.");
}

main()
  .then(async () => {
    console.log("Seeding completed.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
