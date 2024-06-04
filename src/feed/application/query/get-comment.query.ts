import { Types } from "mongoose"

export type GetCommentQuery = {
  page: number
  size: number
  feedId: Types.ObjectId
  userId: Types.ObjectId
}
