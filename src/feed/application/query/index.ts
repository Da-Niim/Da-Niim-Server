import { Types } from "mongoose"

export type GetCommentQuery = {
  page: number
  size: number
  feedId: Types.ObjectId
  userId: Types.ObjectId
}

export type GetFeedQuery = {
  userId: Types.ObjectId
  order: string
  region: string
  hashtag: string
  page: number
  size: number
}

export type GetMyPageFeedQuery = {
  userId: Types.ObjectId
  page: number
  size: number
}

export class GetProfileFeedQuery {
  page: number
  size: number
  userId: Types.ObjectId
  target: Types.ObjectId

  constructor(data: {
    userId: Types.ObjectId
    target: Types.ObjectId
    page: number
    size: number
  }) {
    this.userId = data.userId
    this.target = data.target ? data.target : data.userId
    this.page = data.page
    this.size = data.size
  }
}

export type GetSubCommentQuery = {
  page: number
  size: number
  feedId: Types.ObjectId
  commentId: Types.ObjectId
  userId: Types.ObjectId
}
