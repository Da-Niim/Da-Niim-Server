import { HttpException, HttpStatus } from "@nestjs/common"

export class BaseException extends HttpException {
  errorCode: string

  constructor(
    errorCode: string,
    status: HttpStatus,
    objectOrError?: string,
    description: string = "base exception",
  ) {
    super(HttpException.createBody(objectOrError, description, status), status)

    this.errorCode = errorCode
  }
}
