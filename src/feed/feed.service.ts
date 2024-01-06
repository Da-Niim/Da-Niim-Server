import { Injectable } from "@nestjs/common"
import { FeedPostRequest } from "./feed-post.dto"
import { Feed } from "./feed.entity"
import { FeedRepository } from "./feed.repository"
import { Photo } from "../common/photo.model"
import { Types } from "mongoose"

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

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
}
