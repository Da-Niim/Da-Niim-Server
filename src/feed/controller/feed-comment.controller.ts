import {
    Body,
    Controller,
    Param,
    Post,
    Req,
    UseGuards,
  } from "@nestjs/common"
  import { Request } from "express"
  import { Types } from "mongoose"
  import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
  import { AddCommentRequest } from "./dto/add-comment.request"
  import {
    ApiBearerAuth,
    ApiParam,
    ApiTags,
  } from "@nestjs/swagger"
  import { FeedCommentService } from "../application/feed-comment.service"
  
  @Controller("feeds")
  @ApiTags("feeds")
  export class FeedCommentController {
    constructor(
      private readonly feedCommentService: FeedCommentService) {}

    @Post(":id/comments")
    @UseGuards(BearerTokenGuard)
    @ApiBearerAuth("access-token")
    @ApiParam({ name: "id", description: "피드 ID" })
    async addComment(
      @Body() body: AddCommentRequest,
      @Param("id") id: string,
      @Req() req: Request,
    ) {
      await this.feedCommentService.addComment(
        body.toAddCommand(req.user._id, new Types.ObjectId(id)),
      )
    }
  
    @Post(":id/comments/:commentId/subComments")
    @UseGuards(BearerTokenGuard)
    @ApiBearerAuth("access-token")
    @ApiParam({ name: "id", description: "피드 ID" })
    @ApiParam({ name: "commentId", description: "댓글 ID" })
    async addSubComment(
      @Body() body: AddCommentRequest,
      @Param("id") id: string,
      @Param("commentId") commentId: string,
      @Req() req: Request,
    ) {
      await this.feedCommentService.addSubComment(
        body.toAddSubCommand(
          req.user._id,
          new Types.ObjectId(id),
          new Types.ObjectId(commentId),
        ),
      )
    }
  }