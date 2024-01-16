import { Types } from "mongoose"

export type AddCommentCommand = {
  userId: Types.ObjectId
  feedId: Types.ObjectId
  content: string
}
