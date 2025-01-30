const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const prisma = require("../utils/prismaClient");

dotenv.config();

exports.register = async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: "Registration Error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("Invalid user.");
      return res.status(400).json({ error: "Invalid user." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid password." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { status: "ONLINE" },
    });

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Error during login." });
  }
};

exports.logout = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { status: "OFFLINE" },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    res.clearCookie("token");
    res.json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error during logout." });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    res.json({ user }); // No need to return token, since it's already stored in localStorage
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
