const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const upload = require('./middleware/uploadMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://celadon-dusk-483980.netlify.app',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.set('strictQuery', false);

// Connexion MongoDB (avec initialisation des routes à l’intérieur)
async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('Erreur : MONGODB_URI est undefined. Vérifie ton fichier .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connexion à MongoDB réussie');

    // Routes (seulement après la connexion)
    app.get('/', (req, res) => {
      res.json({ message: 'API opérationnelle' });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/tasks', taskRoutes);

    app.post('/api/users/upload-profile', authMiddleware, upload.single('profileImage'), (req, res) => {
      res.status(200).json({ message: '🖼️ Fichier uploadé avec succès', filename: req.file.filename });
    });

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
  }
}

startServer();

module.exports = app;
