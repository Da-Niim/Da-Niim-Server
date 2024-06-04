import { Types } from "mongoose"

export type GetFeedQuery = {
  userId: Types.ObjectId
  order: string
  region: string
  hashtag: string
  page: number
  size: number
}
