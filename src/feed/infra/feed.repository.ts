import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Connection, Model } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { Feed } from "../domain/feed.entity"

@Injectable()
export class FeedRepository extends AbstractRepository<Feed> {
  logger: Logger

  constructor(
    @InjectModel(Feed.name) feedModel: Model<Feed>,
  ) {
    super(feedModel, Feed)
    this.logger = new Logger(FeedRepository.name)
  }
}
