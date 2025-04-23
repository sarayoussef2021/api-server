const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const upload = require('./middleware/uploadMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion MongoDB (via variable d’environnement)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur MongoDB :', err));

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: 'API opérationnelle' });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Route d’upload d’image
app.post('/api/users/upload-profile', authMiddleware, upload.single('profileImage'), (req, res) => {
  res.status(200).json({ message: 'Fichier uploadé avec succès', filename: req.file.filename });
});

// 🟢 Démarrage du serveur —> C'EST ICI QUE TU L'AJOUTES :
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});