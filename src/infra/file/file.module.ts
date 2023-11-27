import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { MulterConfigService } from "./file.configService"
import { FileController } from "./file.controller"

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FileController],
})
export class FileModule {}
