import React from 'react'
import axios from "../axios";
import './NewRoom.css'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


function NewRoom({updateRooms, test}) {

  const createChat = async () => {
    const roomName = prompt("Please enter the name of the chat room");
    if (roomName) {
      await axios.post("/api/v1/rooms/new", {
        name: roomName,
      });
    }
    // update the rooms array everytime a new room is added so that the roomId is fetched
    // from mongodb forthe new room so that it can redirect when the room is selected in the
    // sidebar
    updateRooms();
  };
  return (
    <div className="newRoom" onClick={createChat}>
      <AddCircleOutlineIcon />
      <h2>Add new Chat</h2>
    </div>
  )
}

export default NewRoom
