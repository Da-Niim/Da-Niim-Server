import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Connection, Model } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { Feed } from "./feed.entity"

@Injectable()
export class FeedRepository extends AbstractRepository<Feed> {
  logger: Logger

  constructor(
    @InjectModel(Feed.name) feedModel: Model<Feed>,
    @InjectConnection() connection: Connection,
  ) {
    super(feedModel, connection)
    this.logger = new Logger(FeedRepository.name)
  }
}
