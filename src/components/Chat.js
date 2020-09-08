import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFile from "@material-ui/icons/AttachFile";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
// Importing local axios.js file
import axios from "../axios";
import { useStateValue } from "../StateProvider";
import { useParams } from "react-router";
import Pusher from "pusher-js";


function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [seed, setSeed] = useState('')
  const { roomId } = useParams()

  // load all saved messages and rooms
  useEffect(() => {
    axios.get("/api/v1/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("4d31dc22869a431df2fb", {
      cluster: "ap2",
    });

    const msgChannel = pusher.subscribe("messages");
    msgChannel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    // cleanup function
    // prevent multiple listeners from being initialise. Always only one listener will be present
    return () => {
      msgChannel.unbind_all();
      msgChannel.unsubscribe();
    };
    // specify messages as a dependency as the useEffect depends on the messages useState array
    // Code in useEffect runs everytime the messages array is modified
  }, [messages]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input){
      await axios.post("/api/v1/messages/new", {
        message: input,
        name: user.displayName,
        timestamp: new Date().toUTCString(),
        received: true,
      });
      setInput("");
    }
  };


  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>

        <div className="chat__headerInfo">
          <h3>Main Chat</h3>
          {/* Last seen is the timestamp of last message */}
          <p>
            last seen {" "}
            {messages[messages.length -1]?.timestamp}</p>
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
        {messages.map((message, index) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__receiver"
            }`}
            key={index}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form action="">
          <input
            // we need the value as input because we can write an empty string after pressing enter
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
