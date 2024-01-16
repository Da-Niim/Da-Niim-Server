import { Types } from "mongoose"

export type AddSubCommentCommand = {
  userId: Types.ObjectId
  feedId: Types.ObjectId
  commentId: Types.ObjectId
  content: string
}
