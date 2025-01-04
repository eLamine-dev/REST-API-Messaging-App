const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
