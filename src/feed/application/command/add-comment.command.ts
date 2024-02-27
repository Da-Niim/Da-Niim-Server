import { Types } from "mongoose"

export type AddCommentCommand = {
  userId: Types.ObjectId
  userName: string
  feedId: Types.ObjectId
  content: string
}
