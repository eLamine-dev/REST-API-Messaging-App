const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const prisma = require('../utils/prismaClient');

dotenv.config();

exports.register = async (req, res) => {
   const { email, password, username } = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);

   try {
      const user = await prisma.user.create({
         data: { email, password: hashedPassword, username },
      });
      res.json({ user });
   } catch (error) {
      res.status(400).json({ error: 'User already exists' });
   }
};

exports.login = async (req, res) => {
   const { email, password } = req.body;

   const user = await prisma.user.findUnique({ where: { email } });
   if (!user) return res.status(400).json({ error: 'Invalid credentials' });

   const valid = await bcrypt.compare(password, user.password);
   if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
   });

   await prisma.user.update({
      where: { id: user.id },
      data: { status: 'online' },
   });
   res.json({ token });
};

exports.logout = async (req, res) => {
   console.log('Logging out');

   await prisma.user.update({
      where: { id: req.user.userId },
      data: { status: 'offline' },
   });
   const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
   });
   console.log(user);

   res.clearCookie('token');
   res.json({ message: 'Logged out successfully' });
};
