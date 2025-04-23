// api-server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Inscription d'un utilisateur
const signup = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'L\'email est déjà utilisé' });
    }

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: 'Inscription réussie', token });
  } catch (error) {
    console.error('Erreur d\'inscription', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur de connexion', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Déconnexion d'un utilisateur
const logout = (req, res) => {
  // Pour la déconnexion, nous n'avons rien à faire côté serveur (le client supprime le token)
  res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = { signup, login, logout };