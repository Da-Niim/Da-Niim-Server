import { createParamDecorator, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Types } from "mongoose";
import { FeedLike } from "../domain/feed-like.entity";
import { Feed } from "../domain/feed.entity";
import { AlreadyLikedFeedException } from "../exception/already-like-feed.exception";
import { FeedLikedEvent } from "../event/feed-liked.event";
import { FeedLikeRepository } from "../infra/feed-like.repository";
import { FeedLikeCanceledEvent } from "../event/feed-like-canceled.event";

@Injectable()
export class FeedLikeService {
    constructor(private readonly feedLikeRepository: FeedLikeRepository, private readonly eventEmitter: EventEmitter2) {}

    async likeFeed(userId: Types.ObjectId, feedId: Types.ObjectId) {
        const existFeedLike = await this.feedLikeRepository.findOne({
          userId: userId,
          feedId: feedId,
        })

        if(existFeedLike) throw new AlreadyLikedFeedException()

        const newFeedLike = new FeedLike({
            feedId: feedId,
            userId: userId
        })

        await this.feedLikeRepository.create(newFeedLike)

        this.eventEmitter.emit("feed.liked", new FeedLikedEvent({
            feedId: feedId,
            userId: userId
        }))
    }

    async cancelLikeFeed(data: {userId: Types.ObjectId, feedId: Types.ObjectId}) { 
        const result = await this.feedLikeRepository.delete({ userId: data.userId, feedId: data.feedId })
        
        console.log(result)
        
        if(result.deletedCount == 1) {
            this.eventEmitter.emit("feed.likeCanceled", new FeedLikeCanceledEvent({
                feedId: data.feedId,
                userId: data.userId
            }))
        }
    }


}