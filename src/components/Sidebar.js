import React from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../StateProvider";

function Sidebar({ rooms }) {
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
        {/* This first component reders the "Add new Chat" button */}
        <SidebarChat addNewChat />

        {rooms.map((room) => (
          // room.id is the _id assigned by MongoDB for each room
          <SidebarChat
            key={room._id}
            id={room._id}
            name={room.name}
            lastMessage="How are you doing? 😃"
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
