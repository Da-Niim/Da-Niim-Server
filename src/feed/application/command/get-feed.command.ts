import { Types } from "mongoose";

export type GetFeedCommand = {
    userId: Types.ObjectId,
    order: string
    region: string
    hashtag: string
    page: number,
    size: number
}