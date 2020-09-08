import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Pusher from "pusher-js";
// Importing local axios.js file
import axios from "./axios";
import { useStateValue } from "./StateProvider";

function App() {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([])
  const [{ user }, dispatch] = useStateValue();

  // load all saved messages and rooms
  useEffect(() => {
    axios.get("/api/v1/messages/sync").then((response) => {
      setMessages(response.data);
    });

    axios.get("/api/v1/rooms/sync").then((response) => {
      setRooms(response.data)
    })
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
    const pusher = new Pusher("4d31dc22869a431df2fb", {
      cluster: "ap2",
    });

    const roomChannel = pusher.subscribe("rooms");
    roomChannel.bind("inserted", (newRoom) => {
      setRooms([...rooms, newRoom]);
    });

    // cleanup function
    // prevent multiple listeners from being initialise. Always only one listener will be present
    return () => {
      roomChannel.unbind_all();
      roomChannel.unsubscribe();
    };
    // specify messages as a dependency as the useEffect depends on the messages useState array
    // Code in useEffect runs everytime the messages array is modified
  }, [rooms]);

  console.log(rooms);
  

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
          {/* All components that must be shown irrespective of route path should be outside <Switch> but inside <Router> */}
          <Sidebar rooms={rooms} />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
