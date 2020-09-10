import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import axios from "../axios";
import { Link } from "react-router-dom";

function SidebarChat({ id, name}) {
  const [seed, setSeed] = useState("");
  const [lastMessage, setLastMessage] = useState([]);

  const createChat = async () => {
    const roomName = prompt("Please enter the name of the chat room");
    if (roomName) {
      await axios.post("/api/v1/rooms/new", {
        name: roomName,
      });
    }
  };

  // This is a bit of a hack, not properly done. This function is going to run every second to fetch last message
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`/api/v1/rooms/last-message/${id}`).then((response) => {
        setLastMessage(response.data);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    // use the id we get from params to redirect to correct room page
    // VERY IMPORTANT
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{lastMessage?.message}</p>
        </div>
      </div>
    </Link>
  )
}

export default SidebarChat;
