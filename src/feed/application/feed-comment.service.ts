import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { FeedComment } from "../domain/feed-comment.entity";
import { FeedCommentAddedEvent } from "../event/feed-comment-added.event";
import { SubCommentAdditionException } from "../exception/subcomment-addition.exception";
import { FeedCommentRepository } from "../infra/feed-comment.repository";
import { AddCommentCommand } from "./command/add-comment.command";
import { AddSubCommentCommand } from "./command/add-subcomment.command";

@Injectable()
export class FeedCommentService {
    constructor(private readonly feedCommentRepository: FeedCommentRepository, private readonly eventEmitter: EventEmitter2) {}

    async addComment(cmd: AddCommentCommand) {
        const feedComment = await FeedComment.create({
            content: cmd.content,
            feedId: cmd.feedId,
            userId: cmd.userId
        })

        await this.feedCommentRepository.create(feedComment)

        this.eventEmitter.emit("feed.commentAdded", new FeedCommentAddedEvent({
            feedId: cmd.feedId,
            userId: cmd.userId
        }))
    }


  async addSubComment(cmd: AddSubCommentCommand) {
    const parentComment = new FeedComment(await this.feedCommentRepository.getOne({
      _id: cmd.commentId,
    }))
    if(parentComment.parentId) throw new SubCommentAdditionException()

    const subComment = parentComment.addSubComment(cmd.userId, cmd.content)
    await this.feedCommentRepository.create(subComment)
    await this.feedCommentRepository.upsert({_id: cmd.commentId}, parentComment)

    this.eventEmitter.emit("feed.commentAdded", new FeedCommentAddedEvent({
        feedId: cmd.feedId,
        userId: cmd.userId
    }))
  }
}