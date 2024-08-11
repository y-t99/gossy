# chat-room

[![Open in Gitpod](https://img.shields.io/badge/gitpod-online%20code-brightgreen)](https://gitpod.io/#https://github.com/y-t99/chat-room)

A chat web application.

## Architecture

```
        +------------------+
        |                  |
        |  Client(Device)  |
        |                  |
        +------------------+
          |              ∧
          |              |
    Room ID:             |
    Event Type:       Code:               
    Contetnt:         Messsage:           
    ... ...           ... ...             
          |              |                +-------------------------+
          |              |                |       Shared Data       |
          V              |                |   State:                |
        +------------------+              |     Room ID:            |
        |                  | -----------> |     Members:            |
        |      Server      |              |       - ${member id}    |
        |                  | <----------- |   Messages:             |
        +------------------+              |     - ${member id}      |
                                          |       Content:          |
                                          +-------------------------+     
```

### Concepts

#### Users

Each client is associated with a user account, which is identified in application using a unique “user ID”.

#### Devices

As a user, I might have several devices: a desktop client, some web browsers, an Android device, an iPhone, etc. 

#### Events

All data exchanged over application is expressed as an “event”. Typically each client action (e.g. sending a message) correlates with exactly one event. Each event has a type which is used to differentiate different kinds of data. 

The model of conversation history exposed by the client-server API can be considered as a list of events. The server ’linearises’ the eventually-consistent event graph of events into an ’event stream’ at any given point in time:

```
[E0]->[E1]->[E2]->[E3]->[E4]->[E5]
```

#### Room

A room is a conceptual place where users can send and receive events. Events are sent to a room, and all participants in that room with sufficient access will receive the event. 

### Specification

#### Event Types

Events have type to identify message handle method. Room events are split into two categories: 

- State events: These are events which update the metadata state of the room (e.g. room topic, room membership etc). State is keyed by a tuple of event type and a state_key. State in the room with the same key-tuple will be overwritten.

- These are events which describe transient “once-off” activity in a room: typically communication such as sending an instant message.

1. `room.create`: This is the first event in a room and cannot be changed. It acts as the root of all other events.
2. `room.name`: A room has an opaque room ID which is not human-friendly to read. The room name is a human-friendly string designed to be displayed to the end-user. The room name is not unique, as multiple rooms can have the same room name set. 
3. `room.avatar`: A picture that is associated with the room. This can be displayed alongside the room information.
4. `room.join_rules`: Some rooms require that users be invited to it before they can join; others allow anyone to join.
5. `room.member`: Users need to be a member of a room in order to send and receive events in that room. `room.member` allows key `content.membership`.
6. `room.power_levels`: Permissions for rooms are done via the concept of power levels - to do any action in a room a user must have a suitable power level. 
7. `room.message`: This event is used when sending messages in a room. Messages are not limited to be text. The msgtype key outlines the type of message, e.g. text, audio, image, video, etc. The body key is text and MUST be used with every kind of msgtype as a fallback mechanism for when a client cannot render a message. This allows clients to display something even if it is just plain text.

#### Join Rules

Whether a given room is an “invite-only” room is determined by the room config key `room.join_rules`:

1. `public`: This room is free for anyone to join without an invite.
2. `invite`: This room can only be joined if you were invited.
3. `knock`: This room can only be joined if you were invited, and allows anyone to request an invite to the room.

#### Membership

1. `invite`: The user has been invited to participate in the room, but is not yet participating.
2. `joined`: The user can send and receive events in the room.
3. `knocking`: The user has requested to participate in the room, but has not yet been allowed to.
4. `banned`: The user is not allowed to join the room.
5. `leave`: The user cannot send or receive events in the room.

#### MsgType

1. `text`: This message is the most basic message and is used to represent text.
2. `image`: This message represents a single image and an optional thumbnail.
3. `file`: This message represents a generic file.

#### Authentication Types

1. `login.password`
2. `login.sso`
3. `login.email`
4. `login.phone`
5. `login.third_part_platform`

### Data Structure

The application's data transmission package:

```json
{
  "roomId": "string",
  "eventId": "string",
  "eventType": "string",
  "content": { },
  "sender": "string"
}
```
