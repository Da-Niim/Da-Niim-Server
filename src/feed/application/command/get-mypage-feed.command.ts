import { ObjectId, Types } from "mongoose"

export type GetMyPageFeedCommand = {
    userId: Types.ObjectId,
    page: number,
    size: number
}