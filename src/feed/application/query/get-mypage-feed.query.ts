import { ObjectId, Types } from "mongoose"

export type GetMyPageFeedQuery = {
  userId: Types.ObjectId
  page: number
  size: number
}
