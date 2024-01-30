import { HttpStatus } from "@nestjs/common"
import { BaseException } from "src/common/exceptions/base.exception"
import { ErrorCode } from "src/common/exceptions/error-code.enum"

export class AlreadyFollowingException extends BaseException {
  constructor() {
    super(
      ErrorCode.AlreadyFollowing,
      HttpStatus.CONFLICT,
      "",
      "이미 팔로우 중인 사용자입니다.",
    )
  }
}
