const Affectation = require("../models/Affectation");
const UserCart = require("../models/UserCart");
const Mecanicien = require("../models/Mecanicien");

exports.attribuerMecaniciens = async (req, res) => {
  try {
    const { cartId, offreId, mecanicienIds } = req.body;

    // Vérifie que la UserCart existe
    const cart = await UserCart.findById(cartId);
    if (!cart) return res.status(404).json({ msg: "Demande introuvable" });

    // Vérifie que le client a bien validé l'offre
    if (!cart.offreChoisie || cart.offreChoisie.toString() !== offreId) {
      return res.status(400).json({ msg: "Offre non validée par le client." });
    }

    const rendezVous = cart.dateHeureReparation;
    if (!rendezVous) {
      return res.status(400).json({ msg: "Date de rendez-vous non définie par le client." });
    }

    const affectations = [];

    for (const mecanicienId of mecanicienIds) {
      const mecanicien = await Mecanicien.findById(mecanicienId);
      if (!mecanicien || !mecanicien.disponible) {
        continue; // Ignore si indisponible
      }

      // Créer une affectation
      const affectation = await Affectation.create({
        cart: cartId,
        offre: offreId,
        manager: req.user._id,
        mecanicien: mecanicienId,
        rendezVous
      });

      // Marquer comme indisponible
      mecanicien.disponible = false;
      await mecanicien.save();

      affectations.push(affectation);
    }

    res.status(201).json({
      msg: "Affectation(s) enregistrée(s)",
      totalAffectés: affectations.length,
      affectations
    });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

exports.getTachesMecanicien = async (req, res) => {
    try {
      // 🔍 Trouver le mecanicien lié à l'utilisateur connecté
      const mecanicien = await Mecanicien.findOne({ user: req.user._id });
      if (!mecanicien) {
        return res.status(404).json({ msg: "Fiche mécanicien introuvable" });
      }
  
      // 🔎 Récupérer les tâches associées à ce mécanicien
      const taches = await Affectation.find({ mecanicien: mecanicien._id })
        .populate("cart")
        .populate("offre")
        .populate({
            path: "mecanicien",
            populate: { path: "user", select: "name email" }
        })
        .sort({ rendezVous: 1 });
  
      res.json(taches);
    } catch (error) {
      res.status(500).json({ msg: "Erreur serveur", error: error.message });
    }
};

exports.updateStatut = async (req, res) => {
    try {
      const { affectationId } = req.params;
      const { statut } = req.body;
  
      const affectation = await Affectation.findById(affectationId);
      if (!affectation) return res.status(404).json({ msg: "Tâche non trouvée" });

      const mecanicien = await Mecanicien.findOne({ user: req.user._id });
      if (!mecanicien) {
        return res.status(404).json({ msg: "Fiche mécanicien introuvable" });
      }
      
      // Vérifier que c'est bien le mécanicien concerné
      if (affectation.mecanicien.toString() !== mecanicien._id.toString()) {
        return res.status(403).json({ msg: "Vous ne pouvez pas modifier cette tâche" });
      }
  
      if (!["en cours", "terminée"].includes(statut)) {
        return res.status(400).json({ msg: "Statut non valide" });
      }
  
      affectation.statut = statut;
  
      // Si terminé, rendre le mécano dispo
      if (statut === "terminée") {
        const Mecanicien = require("../models/Mecanicien");
        const mecanicien = await Mecanicien.findById(affectation.mecanicien);
        mecanicien.disponible = true;
        await mecanicien.save();
      }
  
      await affectation.save();
  
      res.json({ msg: "Statut mis à jour", affectation });
    } catch (error) {
      res.status(500).json({ msg: "Erreur serveur", error: error.message });
    }
  };
  
  
