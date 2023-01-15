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

#### Room

A room is a conceptual place where users can send and receive events. Events are sent to a room, and all participants in that room with sufficient access will receive the event. 

### Specification

## Relative

### Instant messaging protocol

1. [XMPP vs Matrix vs MQTT: which instant messaging protocol is best for your chat application?](https://www.rst.software/blog/xmpp-vs-matrix-vs-mqtt-which-instant-messaging-protocol-is-best-for-your-chat-application)
2. [Matrix Specification](https://spec.matrix.org)