const Offre = require("../models/Offre");

exports.createOffre = async (req, res) => {
  try {
    const { titre, description, prix } = req.body;
    const offre = new Offre({
      titre,
      description,
      prix,
      createdBy: req.user._id
    });

    await offre.save();
    res.status(201).json({ msg: "Offre créée avec succès", offre });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

exports.getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().populate("createdBy", "username email");
    res.json(offres);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};
