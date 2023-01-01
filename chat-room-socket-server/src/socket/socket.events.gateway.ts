import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
})
export class SocketEventsGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    throw new Error('Method not implemented.');
  }

  handleConnection(client: Socket, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }
}
