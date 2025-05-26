import { configureStore } from "@reduxjs/toolkit";
import roomsReducer from "./slices/roomsSlice";
import roomReducer from "./slices/roomSlice";

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    room: roomReducer,
  },
});
