import { Module } from '@nestjs/common';
import { SocketEventsGateway } from './socket.events.gateway';

@Module({
  providers: [SocketEventsGateway],
})
export class SocketEventsModule {}
