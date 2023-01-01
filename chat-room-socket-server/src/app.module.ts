import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketEventsModule } from './socket/socket.events.module';

@Module({
  imports: [SocketEventsModule],
  controllers: [AppController],
  // The main idea of a provider is that it can be injected as a dependency;
  // this means objects can create various relationships with each other,
  // and the function of "wiring up" instances of objects can largely be delegated to the Nest runtime system.
  providers: [AppService],
})
export class AppModule {}
