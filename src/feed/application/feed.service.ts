import { Inject, Injectable } from "@nestjs/common"
import { Feed } from "../domain/feed.entity"
import { FeedRepository } from "../infra/feed.repository"
import { Types } from "mongoose"
import { FeedLikeRepository } from "../infra/feed-like.repository"
import { FeedCommentRepository } from "../infra/feed-comment.repository"
import { AddCommentCommand } from "./command/add-comment.command"
import { FeedComment } from "../domain/feed-comment.entity"
import { AddressResolver } from "../domain/address-resolver.service"
import { UserRepository } from "src/user/repository/user.repository"
import { GetFeedCommand } from "./command/get-feed.command"
import { PaginationResponse } from "src/common/dto/pagination-response.dto"
import { OnEvent } from "@nestjs/event-emitter"
import { FeedLikedEvent } from "../event/feed-liked.event"
import { FeedCommentAddedEvent } from "../event/feed-comment-added.event"
import { FeedLikeCanceledEvent } from "../event/feed-like-canceled.event"
import { FeedCommentDeletedEvent } from "../event/feed-comment-deleted.event"
import { GetFeedResponse } from "../controller/dto/get-feeds.dto"
import { GetMyPageFeedCommand } from "./command/get-mypage-feed.command"
import { PostFeedCommand } from "./command/post-feed.command"
import { GetProfileFeedCommand } from "./command/get-profile-feed.command"
import { GetProfileFeedResponse } from "../controller/dto/get-profile-feed.dto"
import { FileManager } from "src/common/utils/file.manager"

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
    private readonly feedCommentRepository: FeedCommentRepository,
    private readonly userRepository: UserRepository,
    @Inject("fileUtilsImpl") private readonly fileManager: FileManager,
    @Inject("addressResolverImpl") private readonly addressResolver: AddressResolver,
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

  async getFeeds(cmd: GetFeedCommand): Promise<PaginationResponse<GetFeedResponse[]>> {
    const feeds = await this.feedRepository.findWithPagination(cmd.page, cmd.size, null)
    const totalElements = await this.feedRepository.count(null)
    const user = await this.userRepository.findOne({_id: cmd.userId})
    const likes = await this.feedLikeRepository.find({userId: cmd.userId, feedId: { $in: feeds.map((feed) => feed._id)}})

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetFeedResponse.of(feeds, user, likes, false, this.fileManager, [])
    )
  }

  async getProfileFeeds(cmd: GetProfileFeedCommand): Promise<PaginationResponse<GetProfileFeedResponse[]>> {
    const filterQuery = { userId: cmd.userId }
    const feeds = await this.feedRepository.findWithPagination(cmd.page, cmd.size, filterQuery)
    const totalElements = await this.feedRepository.count(filterQuery)

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetProfileFeedResponse.of(feeds, this.fileManager)
    )
  }

  @OnEvent("feed.liked")
  async onFeedLiked(event: FeedLikedEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))
    feed.like()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.likeCanceled")
  async onFeedLikeCanceled(event: FeedLikeCanceledEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))
    feed.cancelLike()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.commentAdded")
  async onFeedCommentAdded(event: FeedCommentAddedEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))
    feed.addComment()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.commentDeleted")
  async onFeedCommentDeleted(event: FeedCommentDeletedEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))

    feed.deleteComment()
    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }
}
