// api-server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès non autorisé. Token manquant." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); // L'utilisateur est authentifié
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    return res.status(401).json({ error: "Token invalide." });
  }
};

module.exports = authMiddleware;