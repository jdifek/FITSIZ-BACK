const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { register } = require('./controllers/authController.js');
const { getUser } = require('./controllers/userController.js');
const { getMasks, getMaskInstructions } = require('./controllers/maskController.js');
const { getCatalog } = require('./controllers/catalogController.js');
const { getVideos } = require('./controllers/videoController.js');
const { updateProfile } = require('./controllers/profileController.js');
const {
  loginAdmin,
  createMask,
  updateMask,
  deleteMask,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  createVideo,
  updateVideo,
  deleteVideo,
  getUsers,
  deleteUser,
  createAdmin,
} = require('./controllers/adminController.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
}));

// Публичные эндпоинты
app.post('/api/register', register);
app.get('/api/user/:telegramId', getUser);
app.get('/api/masks', getMasks);
app.get('/api/masks/:id/instructions', getMaskInstructions);
app.get('/api/catalog', getCatalog);
app.get('/api/videos', getVideos);
app.post('/api/profile', updateProfile);

// Админские эндпоинты
app.post('/api/admin/login', loginAdmin);
app.post('/api/admin/create', createAdmin); // Новый эндпоинт для создания админа

app.post('/api/admin/masks', createMask);
app.put('/api/admin/masks/:id', updateMask);
app.delete('/api/admin/masks/:id', deleteMask);
app.post('/api/admin/catalog', createCatalogItem);
app.put('/api/admin/catalog/:id', updateCatalogItem);
app.delete('/api/admin/catalog/:id', deleteCatalogItem);
app.post('/api/admin/videos', createVideo);
app.put('/api/admin/videos/:id', updateVideo);
app.delete('/api/admin/videos/:id', deleteVideo);
app.get('/api/admin/users', getUsers);
app.delete('/api/admin/users/:telegramId', deleteUser);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});