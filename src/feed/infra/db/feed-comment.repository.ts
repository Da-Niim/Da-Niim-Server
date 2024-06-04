import { FeedCommentDBEntity } from "./feed-comment.db-entity"
import { Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"

export class FeedCommentRepository extends AbstractRepository<FeedCommentDBEntity> {
  logger: Logger

  constructor(
    @InjectModel(FeedComment.name) feedCommentModel: Model<FeedCommentDBEntity>,
  ) {
    super(feedCommentModel, FeedCommentDBEntity)
    this.logger = new Logger(FeedCommentRepository.name)
  }
}
