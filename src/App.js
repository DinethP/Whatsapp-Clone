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
  const [lastMessages, setLastMessages] = useState([]);
  const [rooms, setRooms] = useState([])
  const [{ user }, dispatch] = useStateValue();


  // load all rooms
  useEffect(() => {
    axios.get("/api/v1/rooms/sync").then((response) => {
      setRooms(response.data)
    })
  }, []);

  // This function is use by NewRoom.js to update rooms when a new room is made
  const updateRooms = () => {
    axios.get("/api/v1/rooms/sync").then((response) => {
      setRooms(response.data)
    })
  }

  // listen to new rooms created
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
      roomChannel.unbind("inserted");
      roomChannel.unsubscribe("rooms");
      pusher.disconnect();
    };
    // specify messages as a dependency as the useEffect depends on the messages useState array
    // Code in useEffect runs everytime the messages array is modified
  }, [rooms]);

  // To fetch last messages
  useEffect(() => {
    axios.get("/api/v1/rooms/last-message").then((response) => {
      setLastMessages(response.data)
    })
  }, [])

  const updateLastMessage = () => {
    axios.get("/api/v1/rooms/last-message").then((response) => {
      setLastMessages(response.data)
    })
  }
  

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
          {/* All components that must be shown irrespective of route path should be outside <Switch> but inside <Router> */}
          <Sidebar rooms={rooms} updateRooms={updateRooms} lastMessages={lastMessages} />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat updateLastMessage={updateLastMessage} />
              </Route>
              <Route path="/">
                <Chat chatUnselected/>
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
