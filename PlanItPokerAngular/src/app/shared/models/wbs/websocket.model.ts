enum WSEventType {
    ROOM_UPDATE = 'room-update',
    VOTE_UPDATE = 'vote-update',
    PLAYER_UPDATE = 'player-update'
  }
  
  export interface WSEvent {
    type: WSEventType;
    roomId: string;
    data: any;
  }