import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

const BASE_URL = `${process.env.REACT_APP_API_URL}/api/rooms`;

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
  });

  const roomsSlice = createSlice({
    name: "rooms",
    initialState: {
      rooms: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchRooms.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchRooms.fulfilled, (state, action) => {
          state.rooms = action.payload;
          state.loading = false;
        })
        .addCase(fetchRooms.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        })
  
        .addCase(createRoom.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createRoom.fulfilled, (state, action) => {
          state.rooms.push(action.payload);
          state.loading = false;
        })
        .addCase(createRoom.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        })
  
        .addCase(deleteRoom.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteRoom.fulfilled, (state, action) => {
          state.rooms = state.rooms.filter((room) => room.id !== action.payload);
          state.loading = false;
        })
        .addCase(deleteRoom.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        })
  
        .addCase(leaveRoom.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(leaveRoom.fulfilled, (state, action) => {
          // Elimină camera din lista userului
          state.rooms = state.rooms.filter((room) => room.id !== action.payload);
          state.loading = false;
        })
        .addCase(leaveRoom.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    },
  });
  

  export const createRoom = createAsyncThunk(
    "rooms/createRoom",
    async (roomData) => {
      const response = await axiosInstance.post(BASE_URL, roomData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    }
  );

  export const deleteRoom = createAsyncThunk(
    "rooms/deleteRoom",
    async (roomId) => {
      await axiosInstance.delete(`${BASE_URL}/${roomId}`);
      return roomId;
    }
  );

  export const leaveRoom = createAsyncThunk(
    "rooms/leaveRoom",
    async (roomId) => {
      const response = await axiosInstance.post(`${BASE_URL}/${roomId}/leave`);
      if (response.status !== 200) throw new Error("Failed to leave room");
      return roomId;
    }
  );



export default roomsSlice.reducer;
