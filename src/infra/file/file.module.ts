import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { memoryStorage } from "multer"
import { AWSS3FileManager } from "./aws-s3-file.manager"
import { FileController } from "./file.controller"
import FileService from "./file.service"

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: "fileManager",
      useClass: AWSS3FileManager,
    },
  ],
  exports: [
    {
      provide: "fileManager",
      useClass: AWSS3FileManager,
    },
  ],
})
export class FileModule {}
