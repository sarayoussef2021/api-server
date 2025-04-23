// api-server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Veuillez entrer un email valide']
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true });

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Middleware pour hasher le mot de passe avant d'enregistrer l'utilisateur
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Créer un modèle Mongoose à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User;