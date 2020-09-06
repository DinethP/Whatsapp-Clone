import React from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFile from "@material-ui/icons/AttachFile";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";


function Chat() {
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />

        <div className="chat__headerInfo">
          <h3>Room name</h3>
          <p>Last seem at...</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        <p className="chat__message">
          <span className="chat__name">Dineth</span>
          This is a message
          <span className="chat__timestamp">
            {new Date().toUTCString()}
          </span>
        </p>
        <p className="chat__message chat__receiver">
          <span className="chat__name">Dineth</span>
          This is a message
          <span className="chat__timestamp">
            {new Date().toUTCString()}
          </span>
        </p>
        
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form action="">
          <input type="text" placeholder="Type a message"/>
          <button type="submit" >Send a message</button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
