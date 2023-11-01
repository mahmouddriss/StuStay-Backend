
const mongoose = require('mongoose');


const logementSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  imageUrl: String,

});

const Logement = mongoose.model('Logement', logementSchema);

module.exports = Logement;
