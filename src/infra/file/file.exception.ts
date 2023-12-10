import { HttpStatus } from "@nestjs/common"
import { BaseException } from "src/common/exceptions/base.exception"
import { ErrorCode } from "src/common/exceptions/error-code.enum"

export class NotAcceptableMimeTypeException extends BaseException {
  constructor(mimetype: string) {
    super(
      ErrorCode.FileMimeTypeNotAcceptable,
      HttpStatus.BAD_REQUEST,
      `${mimetype}은 허용되지 않는 Mimetype 입니다. (허용되는 Mimetype: image/*)`,
      `FileMimeTypeNotAcceptable Exception`,
    )
  }
}
