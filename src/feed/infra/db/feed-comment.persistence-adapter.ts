import { FeedCommentRepository } from "./feed-comment.repository"
import { Injectable } from "@nestjs/common"
import { Types } from "mongoose"
import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"
import { FeedCommentDBEntity } from "./feed-comment.db-entity"
import { FeedCommentPersistentPort } from "src/feed/application/port/feed-comment.persistent-port"
import { Pageable } from "src/common/dto/pageable.dto"

@Injectable()
export class FeedCommentPersistenceAdapter
  implements FeedCommentPersistentPort
{
  constructor(private readonly repository: FeedCommentRepository) {}

  async save(domain: FeedComment): Promise<FeedComment> {
    const savedDBEntity = await this.repository.create(
      FeedCommentDBEntity.fromDomain(domain),
    )

    return savedDBEntity.toDomain()
  }

  async getById(id: Types.ObjectId): Promise<FeedComment> {
    const dbEntity = new FeedCommentDBEntity(
      await this.repository.getOne({ _id: id }),
    )

    return dbEntity.toDomain()
  }

  async upsert(domain: FeedComment): Promise<FeedComment> {
    const dbEntity = FeedCommentDBEntity.fromDomain(domain)

    const updatedDBEntity = await this.repository.upsert(
      { _id: dbEntity._id },
      dbEntity,
    )

    return updatedDBEntity.toDomain()
  }

  async findWithPagination(
    pageable: Pageable,
    query: Partial<FeedComment>,
  ): Promise<Array<FeedComment>> {
    const fetchResult = await this.repository.findWithPagination(
      pageable,
      query,
    )

    const mappedFetchResult = fetchResult.map((value) => {
      return new FeedCommentDBEntity(value)
    })

    return mappedFetchResult.map((value) => {
      return value.toDomain()
    })
  }

  async count(query: Partial<FeedComment>): Promise<number> {
    return await this.repository.count(query)
  }
}
