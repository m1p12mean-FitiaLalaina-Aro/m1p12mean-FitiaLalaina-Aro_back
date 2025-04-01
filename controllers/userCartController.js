const UserCart = require("../models/UserCart");
const Offre = require("../models/Offre");
const mongoose = require('mongoose');

exports.choisirOffreClient = async (req, res) => {
  try {
    const { cartId, offreId } = req.body;

    
    // Vérifier que la UserCart existe
    const cart = await UserCart.findById(cartId);
    if (!cart) return res.status(404).json({ msg: "Demande introuvable" });
    
    if (cart.offreChoisie) {
      return res.status(400).json({ msg: "Une offre a déjà été choisie pour cette demande." });
    }
    // Vérifier que la UserCart appartient bien au client connecté
    if (!cart.user.equals(req.user._id)) {
      return res.status(403).json({ msg: "Accès non autorisé à cette demande" });
    }

    const offre = await Offre.findOne({ _id: offreId, cart: cartId });
    if (!offre) {
      return res.status(400).json({ msg: "Offre non valide pour cette demande" });
    }


    cart.offreChoisie = offreId;
    await cart.save();

    const cartUpdated = await UserCart.findById(cartId).populate("offreChoisie", "titre description");

    res.status(200).json({ msg: "Offre choisie avec succès", cartUpdated });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};


// 🔹 Créer un nouveau UserCart
exports.createUserCart = async (req, res) => {
  try {
    const { marque, probleme, description, budget, dateHeureReparation } = req.body;
    const newCart = new UserCart({
      marque,
      probleme,
      description,
      budget,
      dateHeureReparation,
      user: req.user.id 
    });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ msg: "Erreur lors de la création", error: error.message });
  }
};

// 🔹 Récupérer tous les UserCarts de l'utilisateur connecté
exports.getUserCarts = async (req, res) => {
  try {
    const carts = await UserCart.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(carts);
  } catch (error) {
    res.status(500).json({ msg: "Erreur lors de la récupération", error: error.message });
  }
};

// 🔹 Récupérer un seul UserCart par ID
exports.getUserCartById = async (req, res) => {
  try {
    const cart = await UserCart.findOne({ _id: req.params.id, user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Demande non trouvée" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// 🔹 Mettre à jour un UserCart
exports.updateUserCart = async (req, res) => {
  try {
    const cart = await UserCart.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!cart) return res.status(404).json({ msg: "Demande non trouvée" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Erreur lors de la miseeee à jour", error: error.message });
  }
};

// 🔹 Supprimer un UserCart
exports.deleteUserCart = async (req, res) => {
  try {
    const cart = await UserCart.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Demande non trouvée" });
    res.json({ msg: "Demande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur lors de la suppression", error: error.message });
  }
};
