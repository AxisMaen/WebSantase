export interface JoinRoomRequest {
  roomCode: string;
}

export interface JoinRoomResponse {
  error?: boolean;
  message: string;
}
