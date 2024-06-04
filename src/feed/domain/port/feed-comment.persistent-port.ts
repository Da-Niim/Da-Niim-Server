import { Pageable } from "@types"
import { Types } from "mongoose"
import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"

export interface FeedCommentPersistentPort {
  getById(id: Types.ObjectId): Promise<FeedComment>
  save(domain: FeedComment): Promise<FeedComment>
  upsert(domain: FeedComment): Promise<FeedComment>
  count(query: Partial<FeedComment>): Promise<number>
  findWithPagination(
    pageable: Pageable,
    query: Partial<FeedComment>,
  ): Promise<Array<FeedComment>>
}
