import React, { useState, useEffect, useRef, useCallback } from "react";
import socket from "../utils/socket";
import ".././App.css";

const Chat = ({
  nickname,
  channel,
  onLogOut,
  setCurrentChannel,
  setActiveChannels,
  activeChannels,
  setIsLoggedIn,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/channels/${channel}/messages`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  }, [channel]);

  useEffect(() => {
    fetchMessages();
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, { ...msg, private: true }]);
    });

    socket.on("privateMessageError", (error) => {
      setMessages((prev) => [
        ...prev,
        {
          nickname: "Système",
          message: error.message,
          private: true,
        },
      ]);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("privateMessage");
      socket.off("privateMessageError");
    };
  }, [channel, fetchMessages, nickname]);

  const sendMessage = () => {
    if (message.startsWith("/msg ")) {
      const [, to, ...msgParts] = message.split(" ");
      const privateMessage = msgParts.join(" ");
      const privateMessageData = {
        to,
        from: nickname,
        message: privateMessage,
      };

      if (message.startsWith("/msg Anonyme")) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            nickname: "Système",
            message:
              "Erreur: Vous ne pouvez pas envoyer de message à 'Anonyme'.",
            private: true,
          },
        ]);
        return;
      }

      socket.emit("privateMessage", privateMessageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          nickname: nickname,
          message: `à ${to}: ${privateMessage}`,
          private: true,
        },
      ]);
    } else if (message.startsWith("/nick ")) {
      const newNickname = message.slice(6).trim();
      if (newNickname) {
        socket.emit("chatMessage", {
          nickname,
          message: `/nick ${newNickname}`,
          channel,
        });
      }
    } else if (message.startsWith("/delete ")) {
      const channelName = message.slice(8).trim();
      if (channelName !== "General") {
        socket.emit("chatMessage", {
          nickname,
          message: `/delete ${channelName}`,
          channel,
        });
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            nickname: "Système",
            message: `Vous ne pouvez pas supprimer le canal General.`,
          },
        ]);
      }
    } else if (message.startsWith("/create ")) {
      const channelName = message.slice(8).trim();
      if (channelName) {
        fetch(`http://localhost:5000/api/channels`)
          .then((response) => response.json())
          .then((data) => {
            const channelExists = data.some(
              (channel) => channel.name === channelName
            );
            if (channelExists) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  nickname: "Système",
                  message: `Le canal ${channelName} existe déjà.`,
                },
              ]);
            } else {
              socket.emit("chatMessage", {
                nickname,
                message: `/create ${channelName}`,
                channel,
              });
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la vérification du canal :", error);
          });
      }
    } else if (message.startsWith("/join ")) {
      const newChannel = message.slice(6).trim();
      if (newChannel) {
        socket.emit("NickAndJoinChannel", newChannel, nickname);
        setMessages([]);
        setCurrentChannel(newChannel);
        setActiveChannels((prevChannels) => {
          if (!prevChannels.includes(newChannel)) {
            return [...prevChannels, newChannel];
          }
          return prevChannels;
        });
      }
    } else if (message.startsWith("/quit ")) {
      const channelToQuit = message.slice(6).trim();
      if (channelToQuit) {
        socket.emit("LeaveChannel", channelToQuit, nickname);
        setActiveChannels((prevChannels) =>
          prevChannels.filter((channel) => channel !== channelToQuit)
        );
        if (channel === channelToQuit) {
          const remainingChannels = activeChannels.filter(
            (ch) => ch !== channelToQuit
          );
          if (remainingChannels.length > 0) {
            setCurrentChannel(remainingChannels[0]);
          } else {
            onLogOut();
            setIsLoggedIn(false);
          }
        }
      }
    } else {
      socket.emit("chatMessage", { nickname, message, channel });
    }
    setMessage("");
  };

  return (
    <div className="Chat">
      <div className="chat-container" ref={chatContainerRef}>
        <h1>
          Chat - {channel}
          <img
            src="/info.png"
            alt="info"
            className="info-icon"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          />
          {showInfo && (
            <div className="info-popup">
              <h3>Commandes</h3>
              <p>
                <strong>/msg [user] [message]</strong> : Envoyer un message
                privé à un utilisateur.
              </p>
              <p>
                <strong>/nick [nouveau pseudo]</strong> : Changer de pseudo.
              </p>
              <p>
                <strong>/create [nom du canal]</strong> : Ajouter un nouveau
                canal.
              </p>
              <p>
                <strong>/delete [nom du canal]</strong> : Supprimer un canal.
              </p>
              <p>
                <strong>/join [nom du canal]</strong> : Rejoindre un canal.
              </p>
              <p>
                <strong>/quit [nom du canal]</strong> : Se déconnecter d'un
                canal.
              </p>
              <p>
                <strong>/list</strong> : Lister tous les canaux.
              </p>
              <p>
                <strong>/users</strong> : Lister tous les utilisateurs.
              </p>
            </div>
          )}
        </h1>
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`chat-message ${msg.private ? "private" : ""} ${
              msg.nickname === "Système" ? "system" : ""
            }`}
          >
            <strong>{msg.nickname}</strong>: {msg.message}
          </p>
        ))}
        <input
          type="text"
          placeholder="Tapez votre message ou votre /commande"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={sendMessage}>Envoyer</button>
          <button onClick={onLogOut}>Déconnexion</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
