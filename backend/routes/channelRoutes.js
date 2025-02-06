const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

// Route pour créer un nouveau canal
router.post('/channels', channelController.createChannel);

// Route pour obtenir tous les canaux
router.get('/channels', channelController.getChannels);

// Route pour supprimer un canal
router.delete('/channels/:name', channelController.deleteChannel);

// Route pour ajouter un message à un canal
router.post('/channels/:name/messages', channelController.addMessage);

// Route pour Obtenir tous les messages d'un canal 
router.get('/channels/:name/messages', channelController.getMessages);

module.exports = router;