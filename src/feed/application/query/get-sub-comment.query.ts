import { Types } from "mongoose";

export type GetSubCommentQuery = {
    page: number,
    size: number,
    feedId: Types.ObjectId,
    commentId: Types.ObjectId,
    userId: Types.ObjectId
}