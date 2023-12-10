import { Injectable } from "@nestjs/common"
import { FeedPostDto } from "./feed-post.dto"
import { Feed } from "./feed.entity"
import { FeedRepository } from "./feed.repository"
import { Photo } from "../common/photo.model"

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async postFeed(
    req: FeedPostDto,
    files: Express.Multer.File[],
  ): Promise<string> {
    console.log("files: ")
    console.log(files)
    console.log("req: ")
    console.log(req)
    const feed: Feed = new Feed(
      req.name,
      await Photo.of(files),
      req.content,
      req.tag,
      req.date,
      req.location,
      req.numOfPeople,
      req.expenses,
    )

    const saved = await this.feedRepository.create(feed)

    return saved._id.toString()
  }
}
