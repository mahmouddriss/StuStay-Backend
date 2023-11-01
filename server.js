const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logementRoutes = require('./routes/logement');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données (à personnaliser)
mongoose.connect('mongodb://localhost/stustay_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Gérer les erreurs de connexion à la base de données
mongoose.connection.on('error', (err) => {
  console.error(`Erreur de connexion à la base de données : ${err}`);
});

// Middleware pour analyser le corps des requêtes en JSON
app.use(bodyParser.json());

// Utiliser les routes pour la gestion des logements
app.use('/logements', logementRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
