import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  public getVersion(): string {
    return '1.0.0';
  }

}
