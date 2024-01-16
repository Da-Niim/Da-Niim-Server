import { HttpStatus } from "@nestjs/common"
import { BaseException } from "./base.exception"
import { ErrorCode } from "./error-code.enum"

export class DocumentNotFoundException extends BaseException {
  constructor(message?: string) {
    super(
      ErrorCode.NotFound,
      HttpStatus.BAD_REQUEST,
      "요청한 리소스를 찾을 수 없습니다.",
      message,
    )
  }
}
