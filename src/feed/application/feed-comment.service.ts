import { FeedCommentPersistenceAdapter } from "./../infra/db/feed-comment.persistence-adapter"
import { Inject, Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { FeedComment } from "../domain/feed-comment.domain-entity"
import { SubCommentAdditionException } from "../exception/subcomment-addition.exception"
import { PaginationResponse } from "@types"
import { GetCommentResponse, GetSubCommentResponse } from "@feed/response"
import { AddCommentCommand, AddSubCommentCommand } from "./command"
import { GetCommentQuery, GetSubCommentQuery } from "./query"
import { FeedCommentAddedEvent } from "@feed/event"

@Injectable()
export class FeedCommentService {
  constructor(
    @Inject("feedCommentPersistenceAdapterImpl")
    private readonly repository: FeedCommentPersistenceAdapter,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addComment(cmd: AddCommentCommand) {
    const feedComment = await FeedComment.create({
      content: cmd.content,
      feedId: cmd.feedId,
      userId: cmd.userId,
      userName: cmd.userName,
    })

    await this.repository.save(feedComment)

    this.eventEmitter.emit(
      "feed.commentAdded",
      new FeedCommentAddedEvent({
        feedId: cmd.feedId,
        userId: cmd.userId,
      }),
    )
  }

  async addSubComment(cmd: AddSubCommentCommand) {
    const parentComment = await this.repository.getById(cmd.commentId)
    if (parentComment.parentId) throw new SubCommentAdditionException()

    const subComment = parentComment.addSubComment({ content: cmd.content })

    await this.repository.save(subComment)
    await this.repository.upsert(parentComment)

    this.eventEmitter.emit(
      "feed.commentAdded",
      new FeedCommentAddedEvent({
        feedId: cmd.feedId,
        userId: cmd.userId,
      }),
    )
  }

  async getComment(
    cmd: GetCommentQuery,
  ): Promise<PaginationResponse<GetCommentResponse[]>> {
    const comments = await this.repository.findWithPagination(
      { page: cmd.page, size: cmd.size },
      { feedId: cmd.feedId, parentId: null },
    )
    const totalElements = await this.repository.count({
      feedId: cmd.feedId,
      parentId: null,
    })

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      GetCommentResponse.of(comments, cmd.userId),
    )
  }

  async getSubComments(
    cmd: GetSubCommentQuery,
  ): Promise<PaginationResponse<GetSubCommentResponse[]>> {
    const subComments = await this.repository.findWithPagination(
      { page: cmd.page, size: cmd.size },
      { feedId: cmd.feedId, parentId: cmd.commentId },
    )
    const totalElements = await this.repository.count({
      feedId: cmd.feedId,
      parentId: cmd.commentId,
    })

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      GetSubCommentResponse.of(subComments, cmd.userId),
    )
  }
}
