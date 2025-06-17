const express = require('express');
const cors = require('cors');
const { register } = require('./controllers/authController');
const { getUser } = require('./controllers/userController.js');
const { getMasks } = require('./controllers/maskController.js');
const { getCatalog } = require('./controllers/catalogController.js');
const { getVideos } = require('./controllers/videoController.js');
const { updateProfile } = require('./controllers/profileController.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/api/register', register);
app.get('/api/user/:telegramId', getUser);
app.get('/api/masks', getMasks);
app.get('/api/catalog', getCatalog);
app.get('/api/videos', getVideos);
app.post('/api/profile', updateProfile);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});