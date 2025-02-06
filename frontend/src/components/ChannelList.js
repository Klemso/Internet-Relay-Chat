import React from "react";

const ChannelList = ({ channelList, onChannelClick, activeChannels }) => {
  const truncateName = (name) => {
    return name.length > 9 ? name.substring(0, 9) + "..." : name;
  };

  return (
    <div className="channel-list">
      <h2>Channels</h2>
      {channelList.map((channel, index) => (
        <p
          key={index}
          onClick={() => onChannelClick(channel.name)}
          className={`channel-item ${
            activeChannels.includes(channel.name) ? "active" : ""
          }`}
        >
          {truncateName(channel.name)}
        </p>
      ))}
    </div>
  );
};

export default ChannelList;
