import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FileModule } from "src/infra/file/file.module"
import { FeedController } from "./controller/feed.controller"
import { Feed, FeedSchema } from "./domain/feed.entity"
import { FeedRepository } from "./infra/feed.repository"
import { FeedLike, FeedLikeSchema } from "./domain/feed-like.entity"
import { FeedLikeRepository } from "./infra/feed-like.repository"
import { AuthModule } from "src/auth/auth.module"
import { UserModule } from "src/user/user.module"
import { FeedComment, FeedCommentSchema } from "./domain/feed-comment.entity"
import { FeedCommentRepository } from "./infra/feed-comment.repository"
import { FeedService } from "./application/feed.service"
import { AddressResolverImpl } from "./infra/address-resolver.service.impl"

@Module({
  imports: [
    FileModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: FeedLike.name, schema: FeedLikeSchema },
      { name: FeedComment.name, schema: FeedCommentSchema },
    ]),
  ],
  controllers: [FeedController],
  providers: [
    FeedService,
    FeedRepository,
    FeedLikeRepository,
    FeedCommentRepository,
    { provide: "impl", useClass: AddressResolverImpl },
  ],
})
export class FeedModule {}
