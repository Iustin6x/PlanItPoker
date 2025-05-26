import {
    setRoomInfo,
    setPlayers,
    setStories,
    setVoteSession,
    addPlayer,
  } from "../redux/slices/roomSlice";
  
  let socket;
  
  export const connectWebSocket = (token, roomId, dispatch) => {
    const url = `ws://localhost:8080/ws?token=${encodeURIComponent(token)}`;
  
    socket = new WebSocket(url);
  
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", roomId }));
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      switch (data.type) {
        case "roomInfo":
          dispatch(setRoomInfo(data.room));
          break;
        case "playerList":
          dispatch(setPlayers(data.players));
          break;
        case "storyList":
          dispatch(setStories(data.stories));
          break;
        case "voteSession":
          dispatch(setVoteSession(data.session));
          break;
        case "playerJoined":
          dispatch(addPlayer(data.player));
          break;
        default:
          console.warn("Mesaj necunoscut: ", data);
      }
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    socket.onclose = () => {
      console.log("WebSocket closed");
    };
  };
  
  export const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };
  