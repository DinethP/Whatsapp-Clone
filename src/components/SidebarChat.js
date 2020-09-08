import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import axios from "../axios";
import { Link } from "react-router-dom";

function SidebarChat({ id, name, lastMessage, addNewChat }) {
  const [seed, setSeed] = useState("");

  const createChat = async () => {
    const roomName = prompt("Please enter the name of the chat room");
    console.log(roomName);
    if (roomName) {
      await axios.post("/api/v1/rooms/new", {
        name: roomName,
      });
    }
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  return !addNewChat ? (
    // use the id we get from params to redirect to correct room page
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{lastMessage}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
