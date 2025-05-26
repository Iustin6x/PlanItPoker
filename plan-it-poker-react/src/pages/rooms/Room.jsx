import React from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const RoomPage = () => {
  const { roomId } = useParams();
  useWebSocket(roomId);

  const room = useSelector((state) => state.room);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h1>Room: {room?.name}</h1>
      <p>Card type: {room?.cardType}</p>
    </div>
  );
};

export default RoomPage;