import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../provider/authProvider";
import { connectWebSocket, disconnectWebSocket } from "../websocket/socket";

export const useWebSocket = (roomId) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const isConnected = useRef(false); // previne reconectarea dublă

  useEffect(() => {
    if (!token || !roomId || isConnected.current) return;

    isConnected.current = true;
    connectWebSocket(token, roomId, dispatch);

    return () => {
      disconnectWebSocket();
      isConnected.current = false; // resetăm pentru cleanup real
    };
  }, [token, roomId, dispatch]);
};
