import { HttpException, HttpStatus } from "@nestjs/common"

export class BaseException extends HttpException {
  errorCode: number

  constructor(
    errorCode: number,
    status: HttpStatus,
    objectOrError?: string,
    description: string = "base exception",
  ) {
    super(HttpException.createBody(objectOrError, description, status), status)

    this.errorCode = errorCode
  }
}
