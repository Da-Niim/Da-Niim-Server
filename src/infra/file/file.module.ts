import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { memoryStorage } from "multer"
import { FileController } from "./file.controller"

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    })
  ],
  controllers: [FileController],
})
export class FileModule {}
