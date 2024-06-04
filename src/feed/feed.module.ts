import { FeedCommentPersistenceAdapter } from "./infra/db/feed-comment.persistence-adapter"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FileModule } from "src/infra/file/file.module"
import { Feed, FeedSchema } from "./domain/feed.entity"
import { FeedLike, FeedLikeSchema } from "./domain/feed-like.entity"
import { UserModule } from "src/user/user.module"
import { FeedComment } from "./domain/feed-comment.domain-entity"
import { FeedCommentRepository } from "./infra/db/feed-comment.repository"
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
import { FeedCommentSchema } from "./infra/db/feed-comment.db-entity"
import { FeedRepository } from "./infra/db/feed.repository"
import { FeedLikeRepository } from "./infra/db/feed-like.repository"

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
    {
      provide: "feedCommentPersistenceAdapterImpl",
      useClass: FeedCommentPersistenceAdapter,
    },
    { provide: "addressResolverImpl", useClass: AddressResolverImpl },
  ],
})
export class FeedModule {}
