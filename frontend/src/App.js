import React, { useState, useEffect } from "react";
import socket from "./utils/socket";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import ChannelList from "./components/ChannelList";
import UserList from "./components/UserList";

const App = () => {
  const [nickname, setNickname] = useState("");
  const [activeChannels, setActiveChannels] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [channelList, setChannelList] = useState([]);
  const [users, setUsers] = useState({});
  const [currentChannel, setCurrentChannel] = useState("");

  const handleLogin = (name, channelName) => {
    setNickname(name);
    setActiveChannels([channelName]);
    setCurrentChannel(channelName);
    setIsLoggedIn(true);
    socket.connect();
    socket.emit("NickAndJoinChannel", channelName, name);
  };

  const handleLogOut = (channelName) => {
    if (nickname) {
      const updatedChannels = activeChannels.filter(
        (channel) => channel !== channelName
      );
      setActiveChannels(updatedChannels);
      socket.emit("LeaveChannel", channelName, nickname);
      if (updatedChannels.length === 0) {
        setIsLoggedIn(false);
        socket.disconnect();
        document.title = "IRC Project";
      } else {
        setCurrentChannel(updatedChannels[0]);
      }
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/channels");
      const data = await response.json();
      setChannelList(data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const handleChannelClick = (newChannel) => {
    if (!activeChannels.includes(newChannel)) {
      socket.emit("NickAndJoinChannel", newChannel, nickname);
      setActiveChannels([...activeChannels, newChannel]);
    }
    setCurrentChannel(newChannel);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchChannels();
    }

    socket.on("userList", (userList) => {
      setUsers(userList);
    });
    socket.on("updateChannels", () => {
      fetchChannels();
    });

    return () => {
      socket.off("userList");
      socket.off("updateChannels");
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      document.title = `IRC Project - ${nickname}`;
    }
  }, [isLoggedIn, nickname]);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <ChannelList
            channelList={channelList}
            onChannelClick={handleChannelClick}
            activeChannels={activeChannels}
          />
          {currentChannel && (
            <Chat
              key={currentChannel}
              nickname={nickname}
              channel={currentChannel}
              onLogOut={() => handleLogOut(currentChannel)}
              fetchChannels={fetchChannels}
              setCurrentChannel={setCurrentChannel}
              setActiveChannels={setActiveChannels}
              activeChannels={activeChannels}
              setIsLoggedIn={setIsLoggedIn}
            />
          )}
          <UserList users={users} />
        </>
      )}
    </div>
  );
};

export default App;
