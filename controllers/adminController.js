
const { PrismaClient } = require('@prisma/client');
const { createFeature, updateFeature, deleteFeature } = require('../services/featureService');
const { createReview, updateReview, deleteReview } = require('../services/reviewService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.createFeature = async (req, res) => {
  try {
    const { name, maskId } = req.body;
    if (!name || !maskId) {
      return res.status(400).json({ error: 'Name and maskId are required' });
    }
    const mask = await prisma.mask.findUnique({ where: { id: parseInt(maskId) } });
    if (!mask) {
      return res.status(400).json({ error: 'Mask with provided maskId does not exist' });
    }
    const feature = await createFeature(name, parseInt(maskId));
    res.status(201).json(feature);
  } catch (error) {
    console.error('Create feature error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const feature = await updateFeature(parseInt(id), name);
    res.json(feature);
  } catch (error) {
    console.error('Update feature error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteFeature(parseInt(id));
    res.status(204).send();
  } catch (error) {
    console.error('Delete feature error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { userName, rating, comment, maskId } = req.body;
    if (!userName || !rating) {
      return res.status(400).json({ error: 'userName and rating are required' });
    }
    if (maskId) {
      const mask = await prisma.mask.findUnique({ where: { id: parseInt(maskId) } });
      if (!mask) {
        return res.status(400).json({ error: 'Mask with provided maskId does not exist' });
      }
    }
    const review = await createReview(
      userName,
      parseFloat(rating),
      comment,
      maskId ? parseInt(maskId) : null
    );
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment, maskId } = req.body;
    if (!userName || !rating) {
      return res.status(400).json({ error: 'userName and rating are required' });
    }
    if (maskId) {
      const mask = await prisma.mask.findUnique({ where: { id: parseInt(maskId) } });
      if (!mask) {
        return res.status(400).json({ error: 'Mask with provided maskId does not exist' });
      }
    }
    const review = await updateReview(parseInt(id), userName, parseFloat(rating), comment, maskId ? parseInt(maskId) : null);
    res.json(review);
  } catch (error) {
    console.error('Update review error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteReview(parseInt(id));
    res.status(204).send();
  } catch (error) {
    console.error('Delete review error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    console.log('Creating admin:', { username });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const admin = await prisma.userAdmin.create({
      data: { username, password: hashedPassword },
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
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    console.log('Login attempt:', { username });
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
    const {
      name,
      instructions,
      imageUrl,
      price,
      weight,
      viewArea,
      sensors,
      power,
      shadeRange,
      material,
      description,
      link,
      installment,
      size,
      days,
      extraFields = [], // <-- новые поля
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const mask = await prisma.mask.create({
      data: {
        name,
        instructions: instructions || null,
        imageUrl: imageUrl || null,
        price: price || null,
        weight: weight || null,
        viewArea: viewArea || null,
        sensors: sensors ? parseInt(sensors) : null,
        power: power || null,
        shadeRange: shadeRange || null,
        material: material || null,
        description: description || null,
        link: link || null,
        installment: installment || null,
        size: size || null,
        days: days || null,
        extraFields: {
          create: extraFields
            .filter(f => f.key && f.value) // защита от пустых
            .map(f => ({
              key: f.key,
              value: f.value,
            })),
        },
      },
      include: {
        extraFields: true, // <-- если хочешь вернуть вместе с ответом
      },
    });

    res.status(201).json(mask);
  } catch (error) {
    console.error('Create mask error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateMask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      instructions,
      imageUrl,
      price,
      weight,
      viewArea,
      sensors,
      power,
      shadeRange,
      material,
      description,
      link,
      installment,
      size,
      days,
      extraFields = [], // ✅ получаем доп. поля
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const parsedId = parseInt(id);

    const result = await prisma.$transaction([
      // 1. Обновляем основную маску
      prisma.mask.update({
        where: { id: parsedId },
        data: {
          name,
          instructions: instructions || null,
          imageUrl: imageUrl || null,
          price: price || null,
          weight: weight || null,
          viewArea: viewArea || null,
          sensors: sensors ? parseInt(sensors) : null,
          power: power || null,
          shadeRange: shadeRange || null,
          material: material || null,
          description: description || null,
          link: link || null,
          installment: installment || null,
          size: size || null,
          days: days || null,
        },
      }),

      // 2. Удаляем все старые extraFields
      prisma.extraField.deleteMany({
        where: { maskId: parsedId },
      }),

      // 3. Создаём новые extraFields
      prisma.extraField.createMany({
        data: extraFields
          .filter(f => f.key && f.value)
          .map(f => ({
            key: f.key,
            value: f.value,
            maskId: parsedId,
          })),
      }),
    ]);

    res.json({ updatedMask: result[0] });
  } catch (error) {
    console.error('Update mask error:', error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.deleteMask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mask.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete mask error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const { 
      title, 
      url, 
      description, 
      duration, 
      thumbnailUrl 
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const video = await prisma.video.create({
      data: {
        title,
        url: url || null,
        description: description || null,
        duration: duration || null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });
    res.status(201).json(video);
  } catch (error) {
    console.error('Create video error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      url, 
      description, 
      duration, 
      thumbnailUrl 
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const video = await prisma.video.update({
      where: { id: parseInt(id) },
      data: {
        title,
        url: url || null,
        description: description || null,
        duration: duration || null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });
    res.json(video);
  } catch (error) {
    console.error('Update video error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.video.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete video error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { telegramId } = req.query;
    const users = await prisma.user.findMany({
      where: telegramId ? { telegramId: { contains: telegramId } } : {},
      include: { mask: true }, // Включаем данные о маске
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get getReviews error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.getFeature = async (req, res) => {
  try {
    const feature = await prisma.feature.findMany({
    });
    res.json(feature);
  } catch (error) {
    console.error('Get feature error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { maskId } = req.body;

    if (maskId) {
      const mask = await prisma.mask.findUnique({ where: { id: parseInt(maskId) } });
      if (!mask) {
        return res.status(400).json({ error: 'Mask with provided maskId does not exist' });
      }
    }

    const user = await prisma.user.update({
      where: { telegramId },
      data: { maskId: maskId ? parseInt(maskId) : null },
      include: { mask: true },
    });
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { telegramId } = req.params;
    await prisma.user.delete({ where: { telegramId } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
