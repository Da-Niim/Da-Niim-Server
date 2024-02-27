import { Types } from "mongoose"

export type AddSubCommentCommand = {
  userId: Types.ObjectId
  userName: string
  feedId: Types.ObjectId
  commentId: Types.ObjectId
  content: string
}
