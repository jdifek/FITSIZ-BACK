const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Creating admin:', { username });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const admin = await prisma.userAdmin.create({
      data: { username, password: hashedPassword }
    });
    console.log('Created admin:', { id: admin.id, username: admin.username });

    res.status(201).json({ id: admin.id, username: admin.username });
  } catch (error) {
    console.error('Create admin error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, receivedPassword: password });

    const admin = await prisma.userAdmin.findUnique({ where: { username } });
    console.log('Found admin:', admin ? { id: admin.id, username: admin.username } : 'Admin not found');

    if (!admin) {
      console.log('Admin not found for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password mismatch for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated JWT:', token);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.createMask = async (req, res) => {
  try {
    const { name, instructions } = req.body;
    const mask = await prisma.mask.create({ data: { name, instructions } });
    res.status(201).json(mask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, instructions } = req.body;
    const mask = await prisma.mask.update({
      where: { id: parseInt(id) },
      data: { name, instructions }
    });
    res.json(mask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mask.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCatalogItem = async (req, res) => {
  try {
    const { name, description, link, maskId } = req.body;
    const item = await prisma.catalogItem.create({
      data: { name, description, link, maskId: maskId ? parseInt(maskId) : null }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCatalogItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, link, maskId } = req.body;
    const item = await prisma.catalogItem.update({
      where: { id: parseInt(id) },
      data: { name, description, link, maskId: maskId ? parseInt(maskId) : null }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCatalogItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.catalogItem.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const { title, url } = req.body;
    const video = await prisma.video.create({ data: { title, url } });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;
    const video = await prisma.video.update({
      where: { id: parseInt(id) },
      data: { title, url }
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.video.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { telegramId } = req.params;
    await prisma.user.delete({ where: { telegramId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};