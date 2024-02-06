import { HttpStatus } from "@nestjs/common";
import { BaseException } from "src/common/exceptions/base.exception";
import { ErrorCode } from "src/common/exceptions/error-code.enum";

export class AlreadyLikedFeedException extends BaseException {
    constructor() {
        super(
            ErrorCode.AlreadyLikedFeed,
            HttpStatus.CONFLICT,
            "",
            "이미 좋아요 한 피드입니다."
        )
    }
}