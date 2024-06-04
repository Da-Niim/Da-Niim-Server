import { Types } from "mongoose"

export class FeedComment {
  _id?: Types.ObjectId
  userId: Types.ObjectId
  userName: string
  feedId: Types.ObjectId
  content: string
  parentId?: Types.ObjectId
  likeCount: number
  commentCount: number

  constructor(feedCommentProps: Partial<FeedComment>) {
    Object.assign(this, feedCommentProps)
  }

  static async create(data: {
    content: string
    feedId: Types.ObjectId
    userId: Types.ObjectId
    userName: string
  }): Promise<FeedComment> {
    return new FeedComment({
      userId: data.userId,
      userName: data.userName,
      feedId: data.feedId,
      content: data.content,
      likeCount: 0,
      commentCount: 0,
    })
  }

  addSubComment(param: { content: string }): FeedComment {
    this.commentCount++
    return new FeedComment({
      userId: this.userId,
      userName: this.userName,
      feedId: this.feedId,
      content: param.content,
      parentId: this._id,
      likeCount: 0,
      commentCount: 0,
    })
  }
}
