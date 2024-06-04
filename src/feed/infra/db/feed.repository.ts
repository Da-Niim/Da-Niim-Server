import { Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { Feed } from "src/feed/domain/feed.entity"

@Injectable()
export class FeedRepository extends AbstractRepository<Feed> {
  logger: Logger

  constructor(@InjectModel(Feed.name) feedModel: Model<Feed>) {
    super(feedModel, Feed)
    this.logger = new Logger(FeedRepository.name)
  }
}
