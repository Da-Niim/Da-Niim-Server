import { HttpStatus } from "@nestjs/common";
import { BaseException } from "src/common/exceptions/base.exception";
import { ErrorCode } from "src/common/exceptions/error-code.enum";

export class SubCommentAdditionException extends BaseException {
    constructor() {
        super(
            ErrorCode.SubCommentAddition,
            HttpStatus.BAD_REQUEST,
            "",
            "하위 댓글엔 하위 댓글을 작성할 수 없습니다."
        )
    }
}