// hooks/useWebSocketHandler.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  setRoom,
  setRoomSettings,
} from '../features/room/roomSlice';
import {
  setPlayers,
  updatePlayer,
  disconnectPlayer,
  changeName,
  changeRole,
} from '../features/players/playersSlice';
import {
  setStories,
  addStory,
  updateStory,
  deleteStory,
  setViewedStory,
  setViewedSession,
} from '../features/stories/storiesSlice';
import {
  setVoteSession,
  setHasVoted,
  clearVoteSession,
  clearVotes,
  revealVotes,
  endSession,
} from '../features/votes/votesSlice';

export function useWebSocketHandler(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'roomInfo':
          dispatch(setRoom(message.room));
          break;

        case 'playerList':
          dispatch(setPlayers(message.players || []));
          break;

        case 'noPlayers':
          dispatch(setPlayers([]));
          break;

        case 'playerJoined':
          dispatch(updatePlayer(message.player));
          break;

        case 'playerDisconnected':
          dispatch(disconnectPlayer(message.player.id));
          break;

        case 'playerNameChanged':
          dispatch(changeName({ id: message.playerId, newName: message.newName }));
          break;

        case 'playerRoleChanged':
          dispatch(changeRole({ id: message.playerId, newRole: message.newRole }));
          break;

        case 'storyList':
          dispatch(setStories(message.stories));
          break;

        case 'noStories':
          dispatch(setStories([]));
          break;

        case 'storyCreated':
          dispatch(addStory(message.story));
          break;

        case 'storyUpdated':
          dispatch(updateStory(message.story));
          break;

        case 'storyDeleted':
          dispatch(deleteStory(message.storyId));
          break;

        case 'voteSession':
          dispatch(setVoteSession(message.session || null));
          if (message.hasVoted) {
            dispatch(setHasVoted(message.hasVoted));
          }
          break;

        case 'noActiveVoteSession':
          dispatch(clearVoteSession());
          break;

        case 'voteStarted':
          dispatch(setVoteSession(message.session));
          break;

        case 'votesCleared':
          dispatch(clearVotes());
          break;

        case 'votesRevealed':
          dispatch(revealVotes({ votes: message.votes, result: message.result }));
          break;

        case 'storySkipped':
          dispatch(updateStory(message.story));
          if (message.session) {
            dispatch(setVoteSession(message.session));
          }
          break;

        case 'storyWithSession':
          dispatch(setViewedStory(message.story));
          dispatch(setViewedSession(message.session));
          break;

        case 'voteEnded':
          dispatch(endSession(message.finalValue));
          dispatch(updateStory(message.story));
          break;

        case 'roomSettingsUpdated':
          dispatch(setRoomSettings(message.settings));
          break;

        case 'error':
          console.error('WebSocket Error:', message.message, message.details);
          break;

        default:
          console.warn('Unhandled message type:', message.type);
      }
    };
  }, [socket, dispatch]);
}
