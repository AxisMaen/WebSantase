export interface JoinRoomRequest {
  roomCode: string;
}

export interface RoomEventResponse {
  error?: boolean;
  message: string;
}
