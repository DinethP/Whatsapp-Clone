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
import moment from "moment";

function Chat({ chatUnselected, updateLastMessage }) {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState([]);
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();

  // load all saved messages for specificroomId
  // this useEffect runs when the rooId param is updated
  useEffect(() => {
    axios.get(`/api/v1/messages/sync/${roomId}`).then((response) => {
      setMessages(response.data);
    });
  }, [roomId]);

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
      msgChannel.unbind("inserted");
      msgChannel.unsubscribe("messages");
      pusher.disconnect();
    };
    // specify messages as a dependency as the useEffect depends on the messages useState array
    // Code in useEffect runs everytime the messages array is modified
  }, [messages]);

  // fetch room details
  useEffect(() => {
    if (roomId) {
      axios.get(`/api/v1/rooms/${roomId}`).then((response) => {
        setRoom(response.data);
      });
    }
  }, [roomId]);

  // The avatar is going to change everytime the roomId param is changed in the url
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input) {
      await axios.post("/api/v1/messages/new", {
        message: input,
        name: user.displayName,
        received: true,
        roomId: roomId,
      });
      setInput("");
      updateLastMessage()
    }
  };

  return !chatUnselected ? (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className="chat__headerInfo">
          <h3>{room.name}</h3>
          {/* Last seen is the timestamp of last message */}
          <p>
            last seen{" "}
            {moment(messages[messages.length - 1]?.createdAt).format("llll")}
          </p>
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
        {messages?.map((message, index) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__receiver"
            }`}
            key={index}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {moment(message.createdAt).format("llll")}
            </span>
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
  ) : (
    <div className="chat">
      <div className="chat__body">
        <div className="chat__unselected__container">
          <h2>Please select a chat</h2>
        </div>
      </div>
    </div>
  );
}

export default Chat;
