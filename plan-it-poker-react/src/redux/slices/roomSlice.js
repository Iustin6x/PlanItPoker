import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  cardType: "",
  players: [],
  stories: [],
  voteSession: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setVoteSession: (state, action) => {
      state.voteSession = action.payload;
    },
    addPlayer: (state, action) => {
      state.players.push(action.payload);
    },
  },
});

export const {
  setRoomInfo,
  setPlayers,
  setStories,
  setVoteSession,
  addPlayer,
} = roomSlice.actions;

export default roomSlice.reducer;
