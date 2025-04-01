const Mecanicien = require("../models/Mecanicien");
const User = require("../models/User");

// Créer la fiche métier du mécanicien après la création du compte user
exports.creerFicheMecanicien = async (req, res) => {
  try {
    const { userId, specialite, garage } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== "mecanicien") {
      return res.status(400).json({ msg: "L'utilisateur n'est pas un mécanicien valide." });
    }

    // Vérifier si une fiche existe déjà
    const exist = await Mecanicien.findOne({ user: userId });
    if (exist) return res.status(400).json({ msg: "Ce mécanicien a déjà une fiche." });

    const fiche = await Mecanicien.create({
      user: userId,
      manager: req.user._id,
      specialite,
      garage
    });

    res.status(201).json({ msg: "Fiche mécanicien créée", fiche });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

exports.getAllFichesMecaniciens = async (req, res) => {
    try {
      const fiches = await Mecanicien.find()
        .populate("user", "name email role") 
        .populate("manager", "name email");  
  
      res.json(fiches);
    } catch (error) {
      res.status(500).json({ msg: "Erreur serveur", error: error.message });
    }
};

exports.getBySpecialite = async (req, res) => {
    const { nom } = req.params;
    const mecaniciens = await Mecanicien.find({ specialites: nom }).populate("user", "username email");
    res.json(mecaniciens);
};

exports.ajouterSpecialites = async (req, res) => {
    try {
      const { mecanicienId, specialites } = req.body;

      if (!Array.isArray(specialites) || specialites.length === 0) {
        return res.status(400).json({ msg: "Veuillez fournir une liste de spécialités." });
      }
  
      const mecanicien = await Mecanicien.findById(mecanicienId);
      if (!mecanicien) return res.status(404).json({ msg: "Mécanicien introuvable." });
  
      const nouvelles = specialites.filter(s => !mecanicien.specialites.includes(s));
      mecanicien.specialites.push(...nouvelles);
  
      await mecanicien.save();
      res.status(200).json({ msg: "Spécialités ajoutées avec succès", specialites: mecanicien.specialites });
    } catch (err) {
      res.status(500).json({ msg: "Erreur serveur", error: err.message });
    }
  };
