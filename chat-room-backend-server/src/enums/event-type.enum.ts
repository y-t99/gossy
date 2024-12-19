/**
 * Room events are split into two categories:
 *
 * State events: These are events which update the metadata state of the room (e.g. room topic, room membership etc).
 * State is keyed by a tuple of event type and a state_key.
 * State in the room with the same key-tuple will be overwritten.
 *
 * Message events: These are events which describe transient “once-off” activity in a room:
 * typically communication such as sending an instant message or setting up a VoIP call.
 *
 * @see https://spec.matrix.org/v1.12/client-server-api/#types-of-room-events
 */
export enum RoomEventType {
  /**
   * This event is used to inform the room about which alias should be considered the canonical one, and which other aliases point to the room.
   * This could be for display purposes or as suggestion to users which alias to use to advertise and access the room.
   *
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomcanonical_alias
   */
  ROOM_CANONICAL_ALIAS = 'm.room.canonical_alias',

  /**
   * This is the first event in a room and cannot be changed. It acts as the root of all other events.
   *
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomcreate
   */
  ROOM_CREATE = 'm.room.create',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomjoin_rules
   */
  ROOM_JOIN_RULES = 'm.room.join_rules',

  /**
   * Event type: State event
   * State key: The user_id this membership event relates to. In all cases except for when membership is join, the user ID sending the event does not need to match the user ID in the state_key, unlike other events. Regular authorisation rules still apply.
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroommember
   */
  ROOM_MEMBER = 'm.room.member',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroompower_levels
   */
  ROOM_POWER_LEVELS = 'm.room.power_levels',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomname
   */
  ROOM_NAME = 'm.room.name',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomtopic
   */
  ROOM_TOPIC = 'm.room.topic',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomavatar
   */
  ROOM_AVATAR = 'm.room.avatar',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroompinned_events
   */
  ROOM_PINNED_EVENTS = 'm.room.pinned_events',

  /**
   * This event is used when sending messages in a room. Messages are not limited to be text. The msgtype key outlines the type of message, e.g. text, audio, image, video, etc. The body key is text and MUST be used with every kind of msgtype as a fallback mechanism for when a client cannot render a message. This allows clients to display something even if it is just plain text.
   *
   * Event type: Message event
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroommessage
   */
  ROOM_MESSAGE = 'm.room.message',
}
