import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"
import { BaseEntityMapper } from "./../../../common/infra/db/interface.entity-mapper"
import { FeedCommentDBEntity } from "./feed-comment.db-entity"

export class FeedCommentEntityMapper
  implements BaseEntityMapper<FeedCommentDBEntity, FeedComment>
{
  toDBEntity(domain: FeedComment): FeedCommentDBEntity {
    return new FeedCommentDBEntity({
      _id: domain._id,
      feedId: domain.feedId,
      userId: domain.userId,
      userName: domain.userName,
      content: domain.content,
      likeCount: domain.likeCount,
      commentCount: domain.commentCount,
    })
  }

  toDomainEntity(dbEntity: FeedCommentDBEntity): FeedComment {
    return new FeedComment({
      _id: dbEntity._id,
      feedId: dbEntity.feedId,
      userId: dbEntity.userId,
      userName: dbEntity.userName,
      content: dbEntity.content,
      likeCount: dbEntity.likeCount,
      commentCount: dbEntity.commentCount,
    })
  }
}
