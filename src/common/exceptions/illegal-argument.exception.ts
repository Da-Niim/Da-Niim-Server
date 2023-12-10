import { HttpStatus } from "@nestjs/common"
import { BaseException } from "./base.exception"
import { ErrorCode } from "./error-code.enum"

export class IllegalArgumentException extends BaseException {
  constructor(message?: string) {
    super(
      ErrorCode.IllegalArgument,
      HttpStatus.BAD_REQUEST,
      "유효하지 않은 사용자 요청입니다.",
      message,
    )
  }
}
