import { Types } from "mongoose"

export type AddCommentCommand = {
  userId: Types.ObjectId
  userName: string
  feedId: Types.ObjectId
  content: string
}

export type AddSubCommentCommand = {
  userId: Types.ObjectId
  userName: string
  feedId: Types.ObjectId
  commentId: Types.ObjectId
  content: string
}

export type PostFeedCommand = {
  userId: Types.ObjectId
  title: string
  content: string
  tag: string[]
  date?: string
  numOfPeople?: number
  expenses?: number
  files: Express.Multer.File[]
}
