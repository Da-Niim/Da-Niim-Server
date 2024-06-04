import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { PaginationRequest } from "src/common/dto/pagination-request.dto"
import { GetSubCommentQuery } from "src/feed/application/query/get-sub-comment.query"
import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"

class GetSubCommentRequest extends PaginationRequest {
  toQuery(
    feedId: Types.ObjectId,
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
  ): GetSubCommentQuery {
    return {
      page: this.page,
      size: this.size,
      feedId: feedId,
      commentId: commentId,
      userId: userId,
    }
  }
}

class GetSubCommentResponse {
  @ApiProperty({ description: "댓글 ID" })
  id: string
  @ApiProperty({ description: "작성자 이름" })
  author: string
  @ApiProperty({ description: "댓글 내용" })
  content: string
  @ApiProperty({ description: "좋아요 갯수" })
  likeCount: number
  @ApiProperty({ description: "내 댓글 여부" })
  own: boolean

  constructor(data: {
    [P in keyof GetSubCommentResponse]: GetSubCommentResponse[P]
  }) {
    Object.assign(this, data)
  }

  static of(
    comments: Partial<FeedComment>[],
    userId: Types.ObjectId,
  ): GetSubCommentResponse[] {
    return comments.map((value) => {
      return {
        id: value._id.toString(),
        author: value.userName,
        content: value.content,
        likeCount: value.likeCount,
        own: userId.equals(value.userId),
      }
    })
  }
}

export { GetSubCommentRequest, GetSubCommentResponse }
