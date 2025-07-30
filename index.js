
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { register } = require('./controllers/authController.js');
const { getUser } = require('./controllers/userController.js');
const { getMasks, getMaskInstructions, getMask } = require('./controllers/maskController.js');
const { getVideos, getVideo } = require('./controllers/videoController.js');
const { updateProfile } = require('./controllers/profileController.js');
const {
  loginAdmin,
  createMask,
  updateMask,
  deleteMask,
  createVideo,
  updateVideo,
  deleteVideo,
  getUsers,
  updateUser,
  deleteUser,
  createAdmin,
  createFeature,
  updateFeature,
  deleteFeature,
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getFeature,
  getSettings,
  updateSetting,
  sendGlobalMessage,
} = require('./controllers/adminController.js');
// require('./bot');
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());

// Публичные эндпоинты
app.post('/api/register', register);
app.get('/api/user/:telegramId', getUser);
app.get('/api/masks/:id', getMask);
app.get('/api/masks', getMasks);
app.get('/api/masks/:id/instructions', getMaskInstructions);
app.get('/api/videos', getVideos);
app.get('/api/videos/:id', getVideo); // New route
app.post('/api/profile', updateProfile);

// Админские эндпоинты
app.post('/api/admin/login', loginAdmin);
app.post('/api/admin/create', createAdmin);
app.post('/api/admin/masks', createMask);
app.put('/api/admin/masks/:id', updateMask);
app.delete('/api/admin/masks/:id', deleteMask);
app.post('/api/admin/videos', createVideo);
app.put('/api/admin/videos/:id', updateVideo);
app.delete('/api/admin/videos/:id', deleteVideo);
app.get('/api/admin/users', getUsers);
app.put('/api/admin/users/:telegramId', updateUser);
app.delete('/api/admin/users/:telegramId', deleteUser);
app.post('/api/admin/features', createFeature);
app.get('/api/admin/features', getFeature);
app.put('/api/admin/features/:id', updateFeature);
app.delete('/api/admin/features/:id', deleteFeature);
app.post('/api/admin/reviews', createReview);
app.get('/api/admin/reviews', getReviews);
app.put('/api/admin/reviews/:id', updateReview);
app.delete('/api/admin/reviews/:id', deleteReview);


app.get('/api/admin/settings', getSettings);
app.post('/api/admin/settings', updateSetting);
app.post('/api/admin/send-message', sendGlobalMessage);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
