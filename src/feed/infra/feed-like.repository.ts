import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Connection, Model } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { FeedLike } from "../domain/feed-like.entity"

@Injectable()
export class FeedLikeRepository extends AbstractRepository<FeedLike> {
  logger: Logger

  constructor(
    @InjectModel(FeedLike.name) feedLikeModel: Model<FeedLike>,
  ) {
    super(feedLikeModel, FeedLike)
    this.logger = new Logger(FeedLikeRepository.name)
  }
}
