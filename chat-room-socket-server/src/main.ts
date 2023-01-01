import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create a nest application by `NestFactory`.
  // The `app` implement `INestApplication` interface.
  // The `app` actually is `NestExpressApplication` or `NestFastifyApplication`.
  // default: const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Note, however, you don't need to specify a type unless you actually want to access the underlying platform API.
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
