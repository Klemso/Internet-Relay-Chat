import React, { useState, useEffect } from "react";

const Login = ({ onLogin }) => {
  const [nickname, setNickname] = useState("");
  const [channelName, setChannelName] = useState("");
  // const [newChannelName, setNewChannelName] = useState("");
  const [channels, setChannels] = useState([]);

  const fetchChannels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/channels");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des canaux");
      }
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleLogin = () => {
    if (channelName) {
      onLogin(nickname || "Anonyme", channelName);
    } else {
      alert("Veuillez sélectionner un canal.");
    }
  };

  // const createChannel = async () => {
  //   if (newChannelName) {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/channels", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ name: newChannelName }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Erreur lors de la création du canal");
  //       }

  //       const data = await response.json();
  //       console.log("Channel created:", data);
  //       setNewChannelName("");
  //       fetchChannels();
  //     } catch (error) {
  //       console.error("Error creating channel:", error);
  //     }
  //   }
  // };

  return (
    <div className="login-container">
      <div className="login-module">
        <h1>
          Bienvenue sur <br />{" "}
          <strong style={{ color: "#ffcc00" }}>GELANO</strong>
        </h1>
        <select
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        >
          <option value="">Sélectionnez un canal</option>
          {channels.map((channel) => (
            <option key={channel._id} value={channel.name}>
              {channel.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Pseudo (optionnel)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <button onClick={handleLogin}>Rejoindre</button>
        {/* <input
          type="text"
          placeholder="Nom de votre channel"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createChannel();
            }
          }}
        />
        <button onClick={createChannel}>Créer la Channel</button> */}
      </div>
    </div>
  );
};

export default Login;
