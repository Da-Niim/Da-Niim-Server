import { HttpStatus } from "@nestjs/common";
import { BaseException } from "./base.exception";
import { ErrorCode } from "./error-code.enum";

export class RequireImageException extends BaseException {
    constructor() {
        super(
            ErrorCode.RequireImage,
            HttpStatus.BAD_REQUEST,
            "",
            "이미지는 필수 항목입니다."
        )
    }
}