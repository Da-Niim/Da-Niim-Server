import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { PaginationRequest } from "src/common/dto/pagination-request.dto";
import { GetCommentQuery } from "src/feed/application/query/get-comment.query";
import { FeedComment } from "src/feed/domain/feed-comment.entity";

class GetCommentRequest extends PaginationRequest {

    toQuery(feedId: Types.ObjectId, userId: Types.ObjectId): GetCommentQuery {
        return {
            page: this.page,
            size: this.size,
            feedId: feedId,
            userId: userId
        }
    }
}

class GetCommentResponse {
    @ApiProperty({description: "댓글 ID"})
    id: string
    @ApiProperty({description: "작성자 이름"})
    author: string
    @ApiProperty({description: "댓글 내용"})
    content: string
    @ApiProperty({description: "좋아요 갯수"})
    likeCount: number
    @ApiProperty({description: "댓글 개수"})
    commentCount: number
    @ApiProperty({description: "내 댓글 여부"})
    own: boolean
    @ApiProperty({description: "하위 댓글 여부"})
    hasSubComments: boolean

    constructor(data: {[P in keyof GetCommentResponse]: GetCommentResponse[P]}) {
        Object.assign(this, data)
    }
    
    static of(comments: Partial<FeedComment>[], userId: Types.ObjectId): GetCommentResponse[] {
        return comments.map((value) => {
            return {
                id: value._id.toString(),
                author: "TODO",
                content: value.content,
                likeCount: value.likeCount,
                commentCount: value.commentCount,
                own: userId.equals(value.userId),
                hasSubComments: value.commentCount > 0,
            } 
        })
    }
}

export {
    GetCommentRequest,
    GetCommentResponse
}