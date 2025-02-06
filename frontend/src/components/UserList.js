import React from "react";
import ".././App.css";

const UserList = ({ users }) => {
  const truncateName = (name) => {
    return name.length > 9 ? name.substring(0, 9) + "..." : name;
  };
  return (
    <div className="user-list">
      <h2>Users</h2>
      {Object.values(users).map((user, index) => (
        <p key={index}>{truncateName(user)}</p>
      ))}
    </div>
  );
};

export default UserList;
