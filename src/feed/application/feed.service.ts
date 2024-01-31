import { Inject, Injectable } from "@nestjs/common"
import { Feed } from "../domain/feed.entity"
import { FeedRepository } from "../infra/feed.repository"
import { Types } from "mongoose"
import { FeedLikeRepository } from "../infra/feed-like.repository"
import { FeedCommentRepository } from "../infra/feed-comment.repository"
import { AddCommentCommand } from "./add-comment.command"
import { FeedComment } from "../domain/feed-comment.entity"
import { AddSubCommentCommand } from "./add-subcomment.command"
import { AddressResolver } from "../domain/address-resolver.service"
import { PostFeedCommand } from "./post-feed.command"
import { UserRepository } from "src/user/repository/user.repository"
import { GetFeedCommand } from "./get-feed.command"
import { GetFeedResponse } from "../controller/get-feeds.dto"

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
    private readonly feedCommentRepository: FeedCommentRepository,
    private readonly userRepository: UserRepository,
    @Inject("impl") private readonly addressResolver: AddressResolver,
  ) {}

  async postFeed(cmd: PostFeedCommand): Promise<string> {
    const feed: Feed = await Feed.create(
      cmd.userId,
      cmd.title,
      cmd.content,
      cmd.tag,
      cmd.date,
      cmd.numOfPeople,
      this.addressResolver,
      cmd.files,
      cmd.expenses,
    )
    const saved = await this.feedRepository.create(feed)

    return saved._id.toString()
  }

  async getFeeds(cmd: GetFeedCommand): Promise<GetFeedResponse[]> {
    const feeds = await this.feedRepository.findWithPagination(cmd.page, cmd.size, null)
    const totalElements = await this.feedRepository.count(null)
    const user = await this.userRepository.findOne({_id: cmd.userId})
    const likes = await this.feedLikeRepository.find({userId: cmd.userId, feedId: { $in: feeds.map((feed) => feed._id)}})
    const commentCount = await this.feedCommentRepository.count({feedId: {$in: feeds.map((feed) => feed._id)}})

    return await GetFeedResponse.of(feeds, user, likes, false, commentCount)
  }

  async likeFeed(userId: Types.ObjectId, feedId: Types.ObjectId) {
    const feed = new Feed(await this.feedRepository.getOne({ _id: feedId }))
    const feedLike = await this.feedLikeRepository.findOne({
      userId: userId,
      feedId: feedId,
    })

    if (feedLike) {
      feed.retractLike()
      await this.feedLikeRepository.delete({ userId: userId, feedId: feedId })
    } else {
      await this.feedLikeRepository.create(feed.addLike(userId))
    }

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  async addComment(cmd: AddCommentCommand) {
    const feed = new Feed(await this.feedRepository.getOne({ _id: cmd.feedId }))

    const comment = feed.addComment(cmd.content, cmd.userId)

    await this.feedCommentRepository.create(comment)
  }

  async addSubComment(cmd: AddSubCommentCommand) {
    const comment = new FeedComment(await this.feedCommentRepository.getOne({
      _id: cmd.commentId,
    }))
    const subComment = comment.addSubComment(cmd.userId, cmd.content)

    await this.feedCommentRepository.create(subComment)
  }
}
