const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const channelRoutes = require("./routes/channelRoutes");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  },
});

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", channelRoutes);

// Stockage en mémoire
const users = {}; // Associe chaque socket ID à un pseudo
const channels = {}; // Associe chaque socket ID à un canal
const userChannels = {};

// Fonction pour enregistrer un message dans la base de données
const saveMessage = async (channelName, user, text) => {
  if (!channelName) {
    console.error("Erreur : channelName est undefined");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:5000/api/channels/${channelName}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, text }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur lors de l'enregistrement du message :", errorText);
      throw new Error("Erreur lors de l'enregistrement du message");
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message :", error);
  }
};

// Socket.IO configuration

// Quand un client se connecte
io.on("connection", async (socket) => {
  console.log(`Nouvel utilisateur connecté : ${socket.id}`);

  socket.on("NickAndJoinChannel", async (channelName, nickname) => {
    // Join the channel
    socket.join(channelName);

    // Initialize userChannels if it doesn't exist
    if (!userChannels[socket.id]) {
      userChannels[socket.id] = [];
    }

    // Add the channel to the user's list of channels
    userChannels[socket.id].push(channelName);

    // Update channels and users objects
    channels[socket.id] = channelName;
    users[socket.id] = nickname;

    // Log the join event
    console.log(`${nickname} a rejoint le canal ${channelName}.`);

    // Notify the user that they have joined the channel
    socket.emit("chatMessage", {
      nickname: "Système",
      message: `Vous avez rejoint le canal ${channelName}.`,
    });

    // Broadcast to the channel that a new user has joined
    socket.broadcast.to(channelName).emit("chatMessage", {
      nickname: "Système",
      message: `${nickname} a rejoint le canal ${channelName}.`,
    });

    // Save the join message to the database
    await saveMessage(
      channelName,
      "Système",
      `${nickname} a rejoint le canal ${channelName}.`
    );

    // Emit the updated user list to all clients
    io.emit("userList", users);
  });
  // Réception d'un message
  socket.on("chatMessage", async (data) => {
    const nickname = users[socket.id] || "Anonyme";
    const channelName = channels[socket.id];
    const messageText = data.message;

    // Check if the message is a /nick command
    if (messageText.startsWith("/nick ")) {
      const newNickname = messageText.slice(6).trim();
      if (newNickname) {
        const oldNickname = users[socket.id];
        users[socket.id] = newNickname;
        console.log(`${oldNickname} a changé son pseudo en ${newNickname}.`);
        io.to(channelName).emit("chatMessage", {
          nickname: "Système",
          message: `${oldNickname} a changé son pseudo en ${newNickname}.`,
        });
        io.emit("userList", users);

        // Enregistrement du message dans la base de données
        await saveMessage(
          channelName,
          "Système",
          `${oldNickname} a changé son pseudo en ${newNickname}.`
        );
      }
    } else if (messageText.startsWith("/create ")) {
      const newChannelName = messageText.slice(8).trim();
      if (newChannelName) {
        try {
          const response = await fetch(`http://localhost:5000/api/channels`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newChannelName }),
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la création du canal");
          }

          io.emit("chatMessage", {
            nickname: "Système",
            message: `${
              users[socket.id]
            } vient de créer le canal ${newChannelName}.`,
          });
          await saveMessage(
            channelName,
            "Système",
            `${users[socket.id]} vient de créer le canal ${newChannelName}.`
          );

          io.emit("updateChannels");
        } catch (error) {
          console.error("Erreur lors de la création du canal :", error);
        }
      }
    } else if (messageText.startsWith("/delete ")) {
      const channelToDelete = messageText.slice(8).trim();
      if (channelToDelete) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/channels/${channelToDelete}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du canal");
          }

          io.emit("chatMessage", {
            nickname: "Système",
            message: `${
              users[socket.id]
            } vient de supprimer le canal ${channelToDelete}.`,
          });
          await saveMessage(
            channelName,
            "Système",
            `${
              users[socket.id]
            } vient de supprimer le canal ${channelToDelete}.`
          );

          io.emit("updateChannels");
        } catch (error) {
          console.error("Erreur lors de la suppression du canal :", error);
        }
      }
    } else if (messageText.startsWith("/list")) {
      try {
        const response = await fetch(`http://localhost:5000/api/channels`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des channels");
        }
        const data = await response.json();
        const channels = data.map((channel) => channel.name).join(", ");
        const messageChannels = channels.length
          ? channels
          : "Aucun canal disponible";

        io.to(channelName).emit("chatMessage", {
          nickname: "Système",
          message: `Liste des canaux: ${messageChannels}`,
        });

        await saveMessage(
          channelName,
          "Système",
          `Liste des canaux: ${messageChannels}`
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des canaux :", error);
        io.to(channelName).emit("chatMessage", {
          nickname: "Système",
          message: `Erreur: ${error.message}`,
        });
      }
    } else if (messageText.startsWith("/users")) {
      const usersInChannel = Object.entries(channels)
        .filter(([id, ch]) => ch === channelName)
        .map(([id]) => users[id])
        .join(", ");
      io.to(channelName).emit("chatMessage", {
        nickname: "Système",
        message: `Utilisateurs dans ce channel: ${usersInChannel}`,
      });
    } else {
      io.to(channelName).emit("chatMessage", {
        nickname,
        message: messageText,
      });

      // Enregistrement du message dans la base de données
      await saveMessage(channelName, nickname, messageText);
    }
  });

  // Réception d'un message privé
  socket.on("privateMessage", async (data) => {
    const { to, from, message } = data;
    const channelName = channels[socket.id];
    const privateMessage = {
      nickname: from,
      message,
      private: true,
    };
    console.log(`Sending private message from ${from} to ${to}`);
    // Récupère le socket.id du destinataire
    const receiverSocketId = Object.keys(users).find(
      (key) => users[key] === to
    );
    console.log(`Receiver's socket ID: ${receiverSocketId}`);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("privateMessage", privateMessage);
    } else {
      console.log(`User ${to} is not connected`);
      // Notify the sender that the recipient does not exist
      socket.emit("privateMessageError", {
        message: `Erreur : l'utilisateur ${to} n'existe pas.`,
      });
    }
    // await saveMessage(channelName, from, `to ` + to + ": " + message);
  });

  socket.on("LeaveChannel", async (channelName, nickname) => {
    console.log(`${nickname} a quitté le canal ${channelName}.`);
    socket.broadcast.to(channelName).emit("chatMessage", {
      nickname: "Système",
      message: `${nickname} a quitté le canal ${channelName}.`,
    });
    await saveMessage(
      channelName,
      "Système",
      `${nickname} a quitté le canal ${channelName}.`
    );
  
    // Remove the user from the channel they are leaving
    socket.leave(channelName);
  
    // Remove the channel from the user's active channels
    if (userChannels[socket.id]) {
      userChannels[socket.id] = userChannels[socket.id].filter(ch => ch !== channelName);
    }
  
    // Update the user's active channel to another existing channel
    if (userChannels[socket.id] && userChannels[socket.id].length > 0) {
      const newActiveChannel = userChannels[socket.id][0];
      channels[socket.id] = newActiveChannel;
      socket.join(newActiveChannel);
      console.log(`${nickname} a rejoint le canal ${newActiveChannel}.`);
      socket.emit("chatMessage", {
        nickname: "Système",
        message: `Vous avez rejoint le canal ${newActiveChannel}.`,
      });
    } else {
      delete channels[socket.id];
    }
  });

  // Quand un client se déconnecte complètement
  socket.on("disconnect", async () => {
    const nickname = users[socket.id];
    const channelName = channels[socket.id];
    delete users[socket.id];
    delete channels[socket.id];
    console.log(`${nickname} s'est déconnecté.`);
    io.emit("userList", users);
    socket.broadcast.emit("chatMessage", {
      nickname: "Système",
      message: `${nickname} s'est déconnecté.`,
    });
    await saveMessage(channelName, "Système", `${nickname} s'est déconnecté.`);
  });
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));