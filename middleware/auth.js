const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔹 Middleware d'authentification (vérifie le token)
exports.authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Accès refusé, token manquant ou invalide" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
  
      const userExists = await User.findById(req.user.id);
      if (!userExists) {
        return res.status(401).json({ msg: "Utilisateur non trouvé" });
      }
  
      next(); 
    } catch (error) {
      res.status(401).json({ msg: "Token invalide" });
    }
  };

// 🔹 Middleware d'autorisation (réservé aux admins)
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Accès interdit, privilèges manager requis" });
  }
  next(); 
};
