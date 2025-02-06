const Channel = require("../models/Channel");

// Créer un nouveau canal
exports.createChannel = async (req, res) => {
  try {
    const { name } = req.body;
    const newChannel = new Channel({ name });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du canal" });
  }
};

// Obtenir tous les canaux
exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des canaux" });
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const channelName = req.params.name;
    const channel = await Channel.findOneAndDelete({ name: channelName });
    if (!channel) {
      return res.status(404).json({ error: "Canal non trouvé" });
    }
    res.status(200).json({ message: "Canal supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du canal" });
  }
};

// Obtenir tous les messages d'un canal
exports.getMessages = async (req, res) => {
  try {
    const channelName = req.params.name;
    const channel = await Channel.findOne({ name: channelName });
    if (!channel) {
      return res.status(404).json({ error: "Channel non trouvée" });
    } else {
      const formateMessages = [];
      channel.messages.map((msg) => {
        formateMessages.push({ nickname: msg.user, message: msg.text });
      });
      res.status(200).json(formateMessages);
    }
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des messages du channel",
    });
  }
};

// Ajouter un message à un canal
exports.addMessage = async (req, res) => {
  try {
    const channelName = req.params.name;
    const { user, text } = req.body;
    const channel = await Channel.findOne({ name: channelName });
    if (!channel) {
      return res.status(404).json({ error: "Canal non trouvé" });
    }
    channel.messages.push({ user, text });
    await channel.save();
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du message" });
  }
};
