import { Injectable } from "@nestjs/common"
import { Feed } from "../domain/feed.entity"
import { FeedRepository } from "../infra/feed.repository"
import { OnEvent } from "@nestjs/event-emitter"
import { FeedLikedEvent } from "../event/feed-liked.event"
import { FeedCommentAddedEvent } from "../event/feed-comment-added.event"
import { FeedLikeCanceledEvent } from "../event/feed-like-canceled.event"
import { FeedCommentDeletedEvent } from "../event/feed-comment-deleted.event"

@Injectable()
export class FeedEventHandler {
  constructor(
    private readonly feedRepository: FeedRepository,
  ) {}

  @OnEvent("feed.liked")
  async onFeedLiked(event: FeedLikedEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))
    feed.like()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.likeCanceled")
  async onFeedLikeCanceled(event: FeedLikeCanceledEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))
    feed.cancelLike()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.commentAdded")
  async onFeedCommentAdded(event: FeedCommentAddedEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))
    feed.addComment()

    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }

  @OnEvent("feed.commentDeleted")
  async onFeedCommentDeleted(event: FeedCommentDeletedEvent) {
    const feed = new Feed(await this.feedRepository.getOne({_id: event.feedId}))

    feed.deleteComment()
    await this.feedRepository.upsert({ _id: feed._id }, feed)
  }
}
