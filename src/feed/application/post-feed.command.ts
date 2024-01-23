import { Types } from "mongoose"

export type PostFeedCommand = {
    userId: Types.ObjectId,
    title: string
    content: string
    tag: string[]
    date?: string
    numOfPeople?: number
    expenses?: number
    files: Express.Multer.File[]
}