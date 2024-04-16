import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Transform } from "class-transformer"
import { ImageFileValidationPipe } from "./file.imageFileValidation.pipe"
import FileService from "./file.service"

@Controller("files")
export class FileController {

  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(new ImageFileValidationPipe())
    file: Express.Multer.File,
  ): Express.Multer.File {
    console.log(file)
    return file
  }

  @Get()
  async getPresignedUrlForUpload(@Query('filename') filename: string) {
    console.log('filename = ', filename)
    return await this.fileService.preparePresignedUrlUpload(filename)
  }
}
