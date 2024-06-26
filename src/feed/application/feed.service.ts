import { Inject, Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { PaginationResponse } from "src/common/dto/pagination-response.dto"
import { FileManager } from "src/infra/file/file.manager"
import { UserRepository } from "src/user/repository/user.repository"
import { GetFeedResponse } from "../controller/dto/get-feeds.dto"
import { GetProfileFeedResponse } from "../controller/dto/get-profile-feed.dto"
import { AddressResolver } from "../domain/address-resolver.service"
import { Feed } from "../domain/feed.entity"
import { FeedCommentAddedEvent } from "../event/feed-comment-added.event"
import { FeedCommentDeletedEvent } from "../event/feed-comment-deleted.event"
import { FeedLikeCanceledEvent } from "../event/feed-like-canceled.event"
import { FeedLikedEvent } from "../event/feed-liked.event"
import { FeedCommentRepository } from "../infra/db/feed-comment.repository"
import { PostFeedCommand } from "./command/post-feed.command"
import { GetFeedQuery } from "./query/get-feed.query"
import { GetProfileFeedQuery } from "./query/get-profile-feed.query"
import { FeedRepository } from "../infra/db/feed.repository"
import { FeedLikeRepository } from "../infra/db/feed-like.repository"

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
    private readonly feedCommentRepository: FeedCommentRepository,
    private readonly userRepository: UserRepository,
    @Inject("fileManager") private readonly fileManager: FileManager,
    @Inject("addressResolverImpl")
    private readonly addressResolver: AddressResolver,
  ) {}

  async postFeed(cmd: PostFeedCommand): Promise<string> {
    const feed: Feed = await Feed.create({
      userId: cmd.userId,
      title: cmd.title,
      content: cmd.content,
      tag: cmd.tag,
      date: cmd.date,
      numOfPeople: cmd.numOfPeople,
      addressResolver: this.addressResolver,
      fileManager: this.fileManager,
      files: cmd.files,
      expenses: cmd.expenses,
    })
    const saved = await this.feedRepository.create(feed)

    return saved._id.toString()
  }

  async getFeeds(
    cmd: GetFeedQuery,
  ): Promise<PaginationResponse<GetFeedResponse[]>> {
    const feeds = await this.feedRepository.findWithPagination(
      { page: cmd.page, size: cmd.size },
      null,
    )
    const totalElements = await this.feedRepository.count(null)
    const user = await this.userRepository.findOne({ _id: cmd.userId })
    const likes = await this.feedLikeRepository.find({
      userId: cmd.userId,
      feedId: { $in: feeds.map((feed) => feed._id) },
    })

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetFeedResponse.of(feeds, user, likes, false, this.fileManager, []),
    )
  }

  async getProfileFeeds(
    cmd: GetProfileFeedQuery,
  ): Promise<PaginationResponse<GetProfileFeedResponse[]>> {
    const filterQuery = { userId: cmd.userId }
    const feeds = await this.feedRepository.findWithPagination(
      { page: cmd.page, size: cmd.size },
      filterQuery,
    )
    const totalElements = await this.feedRepository.count(filterQuery)

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetProfileFeedResponse.of(feeds, this.fileManager),
    )
  }

  @OnEvent("feed.liked")
  async onFeedLiked(event: FeedLikedEvent) {
    const feed = new Feed(
      await this.feedRepository.getOne({ _id: event.feedId }),
    )
    feed.like()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.likeCanceled")
  async onFeedLikeCanceled(event: FeedLikeCanceledEvent) {
    const feed = new Feed(
      await this.feedRepository.getOne({ _id: event.feedId }),
    )
    feed.cancelLike()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.commentAdded")
  async onFeedCommentAdded(event: FeedCommentAddedEvent) {
    const feed = new Feed(
      await this.feedRepository.getOne({ _id: event.feedId }),
    )
    feed.addComment()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.commentDeleted")
  async onFeedCommentDeleted(event: FeedCommentDeletedEvent) {
    const feed = new Feed(
      await this.feedRepository.getOne({ _id: event.feedId }),
    )

    feed.deleteComment()
    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }
}
