import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FileModule } from "src/infra/file/file.module"
import { FeedController } from "./feed.controller"
import { Feed, FeedSchema } from "./domain/feed.entity"
import { FeedRepository } from "./infra/feed.repository"
import { FeedService } from "./feed.service"
import { FeedLike, FeedLikeSchema } from "./domain/feed-like.entity"
import { FeedLikeRepository } from "./infra/feed-like.repository"
import { AuthModule } from "src/auth/auth.module"
import { UserModule } from "src/user/user.module"

@Module({
  imports: [
    FileModule,
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: FeedLike.name, schema: FeedLikeSchema },
    ]),
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository, FeedLikeRepository],
})
export class FeedModule {}
