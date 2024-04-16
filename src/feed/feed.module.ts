import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FileModule } from "src/infra/file/file.module"
import { Feed, FeedSchema } from "./domain/feed.entity"
import { FeedRepository } from "./infra/feed.repository"
import { FeedLike, FeedLikeSchema } from "./domain/feed-like.entity"
import { FeedLikeRepository } from "./infra/feed-like.repository"
import { UserModule } from "src/user/user.module"
import { FeedComment, FeedCommentSchema } from "./domain/feed-comment.entity"
import { FeedCommentRepository } from "./infra/feed-comment.repository"
import { AddressResolverImpl } from "./infra/address-resolver.service.impl"
import { FeedLikeService } from "./application/feed-like.service"
import { FeedCommentService } from "./application/feed-comment.service"
import { EventEmitterDynamicModule } from "src/common/event-emitter.module"
import { PostFeedService } from "./application/post-feed.service"
import { GetFeedService } from "./application/get-feed.service"
import { FeedEventHandler } from "./application/feed-event.handler"
import { PostFeedController } from "./controller/post-feed.controller"
import { GetFeedController } from "./controller/get-feed.controller"
import { FeedLikeController } from "./controller/feed-like.controller"
import { FeedCommentController } from "./controller/feed-comment.controller"
import { AWSS3FileManager } from "src/infra/file/aws-s3-file.manager"

@Module({
  imports: [
    EventEmitterDynamicModule,
    FileModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: FeedLike.name, schema: FeedLikeSchema },
      { name: FeedComment.name, schema: FeedCommentSchema },
    ]),
  ],
  controllers: [
    PostFeedController,
    GetFeedController,
    FeedLikeController,
    FeedCommentController,
  ],
  providers: [
    FeedEventHandler,
    PostFeedService,
    GetFeedService,
    FeedLikeService,
    FeedCommentService,
    FeedRepository,
    FeedLikeRepository,
    FeedCommentRepository,
    { provide: "addressResolverImpl", useClass: AddressResolverImpl },
  ],
})
export class FeedModule {}
