import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ImageFileValidationPipe } from "./file.imageFileValidation.pipe"

@Controller("files")
export class FileController {
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(new ImageFileValidationPipe())
    file: Express.Multer.File,
  ): Express.Multer.File {
    console.log(file)
    return file
  }
}
