const express = require('express');
const cors = require('cors');
const { register } = require('./controllers/authController.js');
const { getUser } = require('./controllers/userController.js');
const { getMasks, getMaskInstructions } = require('./controllers/maskController.js');
const { getCatalog } = require('./controllers/catalogController.js');
const { getVideos } = require('./controllers/videoController.js');
const { updateProfile } = require('./controllers/profileController.js');
const { createMask, deleteUser } = require('./controllers/adminController.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/api/register', register);
app.get('/api/user/:telegramId', getUser);
app.get('/api/masks', getMasks);
app.get('/api/masks/:id/instructions', getMaskInstructions);
app.get('/api/catalog', getCatalog);
app.get('/api/videos', getVideos);
app.post('/api/profile', updateProfile);

// Админские эндпоинты
app.post('/api/admin/masks', createMask);
app.delete('/api/admin/users/:telegramId', deleteUser);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});