import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaginationResponse } from "src/common/dto/pagination-response.dto";
import { GetCommentResponse } from "../controller/dto/get-comment.dto";
import { GetSubCommentResponse } from "../controller/dto/get-sub-comment.dto";
import { FeedComment } from "../domain/feed-comment.entity";
import { FeedCommentAddedEvent } from "../event/feed-comment-added.event";
import { SubCommentAdditionException } from "../exception/subcomment-addition.exception";
import { FeedCommentRepository } from "../infra/feed-comment.repository";
import { AddCommentCommand } from "./command/add-comment.command";
import { AddSubCommentCommand } from "./command/add-subcomment.command";
import { GetCommentQuery } from "./query/get-comment.query";
import { GetSubCommentQuery } from "./query/get-sub-comment.query";

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

  async getComment(cmd: GetCommentQuery): Promise<PaginationResponse<GetCommentResponse[]>> {
    const comments = await this.feedCommentRepository.findWithPagination(cmd.page, cmd.size, { feedId: cmd.feedId, parentId: null})
    const totalElements = await this.feedCommentRepository.count({ feedId: cmd.feedId, parentId: null })

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      GetCommentResponse.of(comments, cmd.userId)
    )
  }
  
  async getSubComments(cmd: GetSubCommentQuery): Promise<PaginationResponse<GetSubCommentResponse[]>> {
    const subComments = await this.feedCommentRepository.findWithPagination(cmd.page, cmd.size, { feedId: cmd.feedId, parentId: cmd.commentId })
    const totalElements = await this.feedCommentRepository.count({ feedId: cmd.feedId, parentId: cmd.commentId })

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      GetSubCommentResponse.of(subComments, cmd.userId)
    )
  }
}