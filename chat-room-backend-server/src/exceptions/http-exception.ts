import { StatusCodes } from 'http-status-codes';
import { ErrcodeEnum } from '../enums';

export class HttpException extends Error {
  constructor(status: StatusCodes, message: ErrcodeEnum, description?: string) {
    super(message);
    this.status = status;
    this.description = description;
  }

  get status() {
    return this.status;
  }

  get description() {
    return this.description;
  }

  set status(status: StatusCodes) {
    this.status = status;
  }

  set description(description: string | undefined) {
    this.description = description;
  }
}
