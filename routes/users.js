const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // Middleware JWT
const upload = require('../middleware/uploadMiddleware'); // Pour gérer le fichier
const router = express.Router();

// 🔐 Obtenir les infos de l'utilisateur
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📝 Mettre à jour nom complet / téléphone
router.put('/update', authMiddleware, async (req, res) => {
  const { fullName, phone } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;

    await user.save();
    res.status(200).json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
  }
});

// 🔑 Modifier mot de passe
router.put('/update-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" });
  }
});

// 📷 Upload image de profil
router.post(
  '/upload-profile',
  authMiddleware,
  upload.single('profileImage'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé." });
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      user.profileImage = req.file.filename;
      await user.save();

      res.status(200).json({
        message: "Image de profil mise à jour avec succès",
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
    }
  }
);

module.exports = router;