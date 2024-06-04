import { Types } from "mongoose"

export class FeedCommentAddedEvent {
  feedId: Types.ObjectId
  userId: Types.ObjectId

  constructor(data: { feedId: Types.ObjectId; userId: Types.ObjectId }) {
    this.feedId = data.feedId
    this.userId = data.userId
  }
}

export class FeedCommentDeletedEvent {
  feedId: Types.ObjectId
  userId: Types.ObjectId

  constructor(data: { feedId: Types.ObjectId; userId: Types.ObjectId }) {
    this.feedId = data.feedId
    this.userId = data.userId
  }
}

export class FeedLikeCanceledEvent {
  feedId: Types.ObjectId
  userId: Types.ObjectId

  constructor(data: { feedId: Types.ObjectId; userId: Types.ObjectId }) {
    this.feedId = data.feedId
    this.userId = data.userId
  }
}

export class FeedLikedEvent {
  feedId: Types.ObjectId
  userId: Types.ObjectId

  constructor(data: { feedId: Types.ObjectId; userId: Types.ObjectId }) {
    this.feedId = data.feedId
    this.userId = data.userId
  }
}

export class FeedPostedEvent {
  userId: Types.ObjectId

  constructor(data: { userId: Types.ObjectId }) {
    this.userId = data.userId
  }
}
