import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat";
import NewRoom from "./NewRoom";
import { useStateValue } from "../StateProvider";

function Sidebar({ rooms, updateRooms, lastMessages }) {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          {/* IconButton makes the icon a clickable button */}
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>

      <div className="sidebar__chats">
        <NewRoom updateRooms={updateRooms} />

        {rooms.map((room) => {
          // try to see if there is a last message
          let finalMessage = lastMessages.find(
            (message) => message.roomId._id == room._id
          );
          let message;
          if (!finalMessage) {
            message = "No messages yet";
          } else {
            message = finalMessage.message;
          }
          // room._id is the id from mongoDB for each room
          return (
            <SidebarChat
              key={room._id}
              id={room._id}
              name={room.name}
              lastMessage={message}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
