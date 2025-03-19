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
        const userExists = await User.findById(decoded.id);
    if (!userExists) {
        return res.status(401).json({ msg: "Utilisateur non trouvé" });
    }
    req.user = userExists;
  
      next(); 
    } catch (error) {
        res.status(401).json({ 
            msg: "Erreur d'authentification",
            error: error.message, 
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
        });
    }
  };

// 🔹 Middleware d'autorisation (réservé aux admins)
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Accès interdit, privilèges manager requis" });
  }
  next(); 
};

exports.checkPermission = (permissionName) => async (req, res, next) => {
    try {
      if (!(await req.user.hasPermission(permissionName))) {
        return res.status(403).json({ msg: `Accès interdit, permission '${permissionName}' requise.` });
      }
      next();
    } catch (error) {
      console.error("Erreur dans checkPermission:", error);
      res.status(500).json({ msg: "Erreur serveur", error: error.message });
    }
  };

