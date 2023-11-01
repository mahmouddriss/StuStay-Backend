const express = require('express');
const router = express.Router();
const logementController = require('../controllers/logement');

router.post('/', logementController.createLogement);

router.get('/', logementController.getAllLogements);

router.put('/:id', logementController.updateLogement);

router.delete('/:id', logementController.deleteLogement);

module.exports = router;
