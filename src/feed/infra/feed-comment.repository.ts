import { Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Connection, Model } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { FeedComment } from "../domain/feed-comment.entity"

export class FeedCommentRepository extends AbstractRepository<FeedComment> {
  logger: Logger

  constructor(
    @InjectModel(FeedComment.name) feedCommentModel: Model<FeedComment>,
    @InjectConnection() connection: Connection,
  ) {
    super(feedCommentModel, connection)
    this.logger = new Logger(FeedCommentRepository.name)
  }
}
