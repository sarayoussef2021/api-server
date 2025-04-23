// api-server/controllers/userController.js
const User = require('../models/User');

// Récupérer les informations de l'utilisateur connecté
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);  // On suppose que le userId est attaché à la requête (via middleware)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur de récupération de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Mettre à jour les informations de l'utilisateur
const updateUser = async (req, res) => {
  const { fullName, phone } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.userId,  // Assurer que le userId est présent dans le token JWT
      { fullName, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur de mise à jour de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Mettre à jour le mot de passe de l'utilisateur
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur de mise à jour du mot de passe', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { getUser, updateUser, updatePassword };