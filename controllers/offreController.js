const Offre = require("../models/Offre");
const UserCart = require("../models/UserCart");

exports.createOffre = async (req, res) => {
  try {
    const { titre, description, prix ,cartId} = req.body;
    const offre = new Offre({
      titre,
      description,
      prix,
      createdBy: req.user._id,
      cart: cartId
    });

    await offre.save();
    res.status(201).json({ msg: "Offre créée avec succès", offre });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

exports.getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().populate("createdBy", "name email");
    res.json(offres);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

exports.getOffresParCartClient = async (req, res) => {
    try {
      const { cartId } = req.params;
  
      // Vérifier que la UserCart appartient au client connecté
      const cart = await UserCart.findById(cartId).populate("user","name email");
      if (!cart) return res.status(404).json({ msg: "Demande non trouvée" });

      if (cart.user.id.toString()!== req.user.id) {
        return res.status(403).json({ msg: "Vous n'avez pas accès à cette demande" });
      }
  
      // Récupérer les offres liées à cette demande
      const offres = await Offre.find({ cart: cartId })
                .populate("createdBy", "name email" );
  
      res.status(200).json({ cart, offres });
    } catch (error) {
      res.status(500).json({ msg: "Erreur serveur", error: error.message });
    }
};

exports.getOffresValidees = async (req, res) => {
  try {
    const managerId = req.user._id;

    // 🔍 Trouver toutes les UserCart où l'offre choisie a été créée par CE manager
    const carts = await UserCart.find({ offreChoisie: { $ne: null } })
      .populate({
        path: "offreChoisie",
        match: { createdBy: managerId }, // 👈 filtre ici
        populate: { path: "createdBy", select: "name email" }
      })
      .populate("user", "username email")
      .lean();

    // ❗ supprimer les carts où l'offreChoisie est null (non créées par ce manager)
    const result = carts.filter(cart => cart.offreChoisie !== null);

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};



