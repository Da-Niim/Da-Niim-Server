import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FileModule } from "src/infra/file/file.module"
import { FeedController } from "./feed.controller"
import { Feed, FeedSchema } from "./feed.entity"
import { FeedRepository } from "./feed.repository"
import { FeedService } from "./feed.service"

@Module({
  imports: [
    FileModule,
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository],
})
export class FeedModule {}
