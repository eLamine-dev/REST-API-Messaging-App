const prisma = require('./prismaClient');
const bcrypt = require('bcrypt');

async function main() {
   console.log('Seeding database...');

   const users = await prisma.user.createMany({
      data: [
         {
            email: 'alice@example.com',
            username: 'Alice',
            password: await bcrypt.hash('123', 10),

            bio: 'Loves programming and coffee.',
         },
         {
            email: 'bob@example.com',
            username: 'Bob',
            password: await bcrypt.hash('123', 10),

            bio: 'Fan of gaming and coding.',
         },
         {
            email: 'charlie@example.com',
            username: 'Charlie',
            password: await bcrypt.hash('123', 10),

            bio: 'Enjoys traveling and photography.',
         },
         {
            email: 'diana@example.com',
            username: 'Diana',
            password: await bcrypt.hash('123', 10),

            bio: 'Data scientist and AI enthusiast.',
         },
      ],
   });
   console.log(`Created ${users.count} users.`);

   const alice = await prisma.user.findUnique({
      where: { email: 'alice@example.com' },
   });
   const bob = await prisma.user.findUnique({
      where: { email: 'bob@example.com' },
   });
   const charlie = await prisma.user.findUnique({
      where: { email: 'charlie@example.com' },
   });
   const diana = await prisma.user.findUnique({
      where: { email: 'diana@example.com' },
   });

   await prisma.friendship.createMany({
      data: [
         { senderId: alice.id, receiverId: bob.id, status: 'ACCEPTED' },
         { senderId: bob.id, receiverId: charlie.id, status: 'PENDING' },
         { senderId: diana.id, receiverId: alice.id, status: 'ACCEPTED' },
      ],
   });
   console.log('Friendships created.');

   const privateConversation = await prisma.conversation.create({
      data: {
         name: null,
         isGroup: false,
         members: { connect: [{ id: alice.id }, { id: bob.id }] },
      },
   });
   console.log('Private conversation created.');

   const groupConversation = await prisma.conversation.create({
      data: {
         name: 'Study Group',
         isGroup: true,
         adminId: alice.id,
         members: {
            connect: [{ id: alice.id }, { id: charlie.id }, { id: diana.id }],
         },
      },
   });
   console.log('Group conversation created.');

   await prisma.message.createMany({
      data: [
         {
            content: 'Hi Bob, how are you?',
            senderId: alice.id,
            receiverId: bob.id,
            conversationId: privateConversation.id,
         },
         {
            content: 'Hi Alice, I am doing great! You?',
            senderId: bob.id,
            receiverId: alice.id,
            conversationId: privateConversation.id,
         },
      ],
   });
   console.log('Messages in private conversation created.');

   await prisma.message.createMany({
      data: [
         {
            content: 'Welcome to the study group!',
            senderId: alice.id,
            conversationId: groupConversation.id,
         },
         {
            content: 'Thanks Alice! Glad to be here.',
            senderId: charlie.id,
            conversationId: groupConversation.id,
         },
         {
            content: 'Looking forward to learning together!',
            senderId: diana.id,
            conversationId: groupConversation.id,
         },
      ],
   });
   console.log('Messages in group conversation created.');
}

main()
   .then(async () => {
      console.log('Seeding completed.');
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
