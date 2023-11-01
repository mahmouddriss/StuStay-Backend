const Logement = require('../models/logement');

exports.createLogement = async (req, res) => {
  try {
    const { title, description, price, location, imageUrl } = req.body;
    const logement = new Logement({ title, description, price, location, imageUrl });
    await logement.save();
    res.status(201).json(logement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du logement' });
  }
};

exports.getAllLogements = async (req, res) => {
  try {
    const logements = await Logement.find();
    res.status(200).json(logements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des logements' });
  }
};

exports.updateLogement = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedLogement = await Logement.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedLogement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du logement' });
  }
};

exports.deleteLogement = async (req, res) => {
  const { id } = req.params;
  try {
    await Logement.findByIdAndRemove(id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du logement' });
  }
};
