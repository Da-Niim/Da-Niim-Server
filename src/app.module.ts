import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { FeedModule } from "./feed/feed.module"
import { DatabaseModule } from "./infra/db/db.module"
import { FileModule } from "./infra/file/file.module"
import { Sample, SampleSchema } from "./sample.model"

@Module({
  imports: [
    FeedModule,
    FileModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
