const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const UserConnected = require("../models/UserConnected");
const RolePermission = require("../models/RolePermission");

const failedLoginAttempts = {};

// 🔹 INSCRIPTION (Register)
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role, specialite } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Utilisateur déjà existant" });

    if (role === "mecanicien" && !req.user?.hasPermission("create_mecanicien")) {
      return res.status(403).json({ msg: "Seuls les managers peuvent créer un mécanicien." });
    }

    const rolePermissions = await RolePermission.findOne({ role }).populate("permissions");
    if (!rolePermissions) return res.status(400).json({ msg: "Rôle invalide" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role ,specialite: role === "mecanicien" ? specialite : undefined });

    await user.save();
    res.status(201).json({ msg: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur",error:error.message });
  }
};



// 🔹 CONNEXION (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si trop de tentatives de connexion
    if (failedLoginAttempts[email] && failedLoginAttempts[email] >= 5) {
      return res.status(429).json({ msg: "Trop de tentatives, réessayez plus tard." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      return res.status(400).json({ msg: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      return res.status(400).json({ msg: "Mots de passe invalides" });
    }

    // Réinitialiser les tentatives après une connexion réussie
    delete failedLoginAttempts[email];

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    let existingSession = await UserConnected.findOne({ userId: user._id });
    if (existingSession) {
      return res.status(400).json({ msg: "Utilisateur déjà connecté !" });
    }

    await new UserConnected({ userId: user._id, token }).save();

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Ancien mot de passe incorrect." });

    user.password = await bcrypt.hash(newPassword, 10); 
    await user.save();

    res.json({ msg: "Mot de passe mis à jour avec succès !" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};


