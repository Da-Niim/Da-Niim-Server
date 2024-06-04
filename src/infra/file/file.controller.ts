import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
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
  async getPresignedUrlForUpload(@Query("filename") filename: string) {
    return await this.fileService.preparePresignedUrlUpload(filename)
  }
}
