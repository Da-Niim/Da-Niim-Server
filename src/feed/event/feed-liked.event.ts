import { Types } from "mongoose"

export class FeedLikedEvent {
  feedId: Types.ObjectId
  userId: Types.ObjectId

  constructor(data: { feedId: Types.ObjectId; userId: Types.ObjectId }) {
    this.feedId = data.feedId
    this.userId = data.userId
  }
}
