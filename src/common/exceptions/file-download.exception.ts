import { HttpStatus } from "@nestjs/common";
import { BaseException } from "./base.exception";
import { ErrorCode } from "./error-code.enum";

export class FileDownloadException extends BaseException {
    constructor() {
        super(
            ErrorCode.FileDownloadError,
            HttpStatus.INTERNAL_SERVER_ERROR,
            "",
            "파일 다운로드에 실패했습니다."
        )
    }
}