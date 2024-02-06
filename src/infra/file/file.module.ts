import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { memoryStorage } from "multer"
import { MulterConfigService } from "./file.configService"
import { FileController } from "./file.controller"

@Module({
  imports: [
    // MulterModule.registerAsync({
    //   useClass: MulterConfigService,
    // }),
    MulterModule.register({
      storage: memoryStorage(),
    })
  ],
  controllers: [FileController],
})
export class FileModule {}
