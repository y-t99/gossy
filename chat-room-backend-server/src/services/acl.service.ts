export type UserRoomAction =
  | 'send_event'
  | 'receive_event'
  | 'request_participation'
  | 'invite_user';

export type UserRoomState =
  | 'unrelated'
  | 'knocking'
  | 'invited'
  | 'joined'
  | 'banned';

export type RoomState = 'public' | 'invite' | 'knock';
