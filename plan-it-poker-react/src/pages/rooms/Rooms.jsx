import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  leaveRoom,
} from "../../redux/slices/roomsSlice";

const Rooms = () => {
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.rooms);

  const [newRoom, setNewRoom] = useState({ name: "", description: "" });

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRoom(newRoom));
    setNewRoom({ name: "", description: "" });
  };

  const handleLeaveRoom = (roomId) => {
    dispatch(leaveRoom(roomId));
  };

  const goToRoom = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className="container">
      <h1>Manage Rooms</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newRoom.description}
          onChange={(e) =>
            setNewRoom({ ...newRoom, description: e.target.value })
          }
        />
        <button type="submit">Create Room</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-item" style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }} onClick={() => navigate(`/rooms/${room.id}`)}>
            <h3>{room.name}</h3>
            <p>Last voted story: {room.lastVotedStory || "N/A"}</p>
            <p>
              Last action date:{" "}
              {room.lastActionTime
                ? new Date(room.lastActionTime).toLocaleString()
                : "N/A"}
            </p>
            <p>Total points: {room.totalPoints || 0}</p>

            <div className="actions" style={{ marginTop: "10px" }}>
              {room.role === "MODERATOR" ? (
                <>
                  <button
                    onClick={() => alert("Edit functionality to be implemented")}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => dispatch(deleteRoom(room.id))}>
                    Delete
                  </button>
                </>
              ) : (
                <button onClick={() => handleLeaveRoom(room.id)}>
                  Leave Room
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
