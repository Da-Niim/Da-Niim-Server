import { ConsoleLogger, Injectable } from "@nestjs/common"
import { FeedPostRequest } from "./feed-post.dto"
import { Feed } from "./domain/feed.entity"
import { FeedRepository } from "./infra/feed.repository"
import { Photo } from "../common/photo.model"
import { Types } from "mongoose"
import { FeedLike } from "./domain/feed-like.entity"
import { FeedLikeRepository } from "./infra/feed-like.repository"
import { IllegalArgumentException } from "src/common/exceptions/illegal-argument.exception"

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
  ) {}

  async postFeed(
    userId: Types.ObjectId,
    req: FeedPostRequest,
    files: Express.Multer.File[],
  ): Promise<string> {
    const feed: Feed = new Feed(
      userId,
      req.title,
      req.content,
      req.tag,
      req.date,
      req.numOfPeople,
      await Photo.of(files),
      req.expenses,
      req.location,
    )
    const saved = await this.feedRepository.create(feed)

    return saved._id.toString()
  }

  async getFeed(title: string) {
    const feed = await this.feedRepository.findOne({ title: title })
    console.log(feed)
  }

  async likeFeed(userId: Types.ObjectId, feedId: Types.ObjectId) {
    const feed = await this.feedLikeRepository.findOne({ _id: feedId })
    if (!feed) throw new IllegalArgumentException()

    const feedLike = await this.feedLikeRepository.findOne({
      userId: userId,
      feedId: feedId,
    })

    if (feedLike) {
      await this.feedLikeRepository.delete({ userId: userId, feedId: feedId })
    } else {
      const newFeedLike = new FeedLike(feedId, userId)
      await this.feedLikeRepository.create(newFeedLike)
    }
  }
}
