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
          V              |                |State:                   |
        +------------------+              |   Room ID:              |
        |                  | -----------> |   Members:              |
        |      Server      |              |     - ${member id}      |
        |                  | <----------- |Messages:                |
        +------------------+              |   - ${member id}        |
                                          |     Content:            |
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

#### EventTypes

Events have type to identify message handle method.

1. `room.create`: This is the first event in a room and cannot be changed. It acts as the root of all other events.

2. `room.name`: A room has an opaque room ID which is not human-friendly to read. The room name is a human-friendly string designed to be displayed to the end-user. The room name is not unique, as multiple rooms can have the same room name set. 

3. `room.avatar`: A picture that is associated with the room. This can be displayed alongside the room information.

4. `room.join_rules`: 

5. `room.member`: 

6. `room.power_levels`:

7. `room.message`: This event is used when sending messages in a room. Messages are not limited to be text. The msgtype key outlines the type of message, e.g. text, audio, image, video, etc. The body key is text and MUST be used with every kind of msgtype as a fallback mechanism for when a client cannot render a message. This allows clients to display something even if it is just plain text.

#### Authentication types

1. `login.password`

2. `login.sso`

3. `login.email`

4. `login.phone`

5. `login.third_part_platform`

## Relative

### Instant messaging protocol

1. [XMPP vs Matrix vs MQTT: which instant messaging protocol is best for your chat application?](https://www.rst.software/blog/xmpp-vs-matrix-vs-mqtt-which-instant-messaging-protocol-is-best-for-your-chat-application)
2. [Matrix Specification](https://spec.matrix.org)