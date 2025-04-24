const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

// Middlewares & Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const upload = require('./middleware/uploadMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://celadon-dusk-483980.netlify.app/', // ton frontend sur Netlify
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug temporaire de la variable d'environnement
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connexion MongoDB
mongoose.set('strictQuery', false);

if (!process.env.MONGODB_URI) {
  console.error(' Erreur : MONGODB_URI est undefined. Vérifie ton fichier .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Connexion à MongoDB réussie'))
  .catch((err) => {
    console.error(' Erreur MongoDB :', err);
    process.exit(1);
  });

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: ' API opérationnelle' });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Upload d’image avec authentification
app.post('/api/users/upload-profile', authMiddleware, upload.single('profileImage'), (req, res) => {
  res.status(200).json({ message: '🖼️ Fichier uploadé avec succès', filename: req.file.filename });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});