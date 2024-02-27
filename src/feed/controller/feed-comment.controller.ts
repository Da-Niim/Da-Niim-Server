import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
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
import { GetCommentRequest, GetCommentResponse } from "./dto/get-comment.dto"
import { PaginationResponse } from "src/common/dto/pagination-response.dto"
import { ApiOkResponsePaginated } from "src/common/decorators/api-pagination-response.decorator"
import { GetSubCommentRequest, GetSubCommentResponse } from "./dto/get-sub-comment.dto"
  
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
        body.toAddCommand({
          userId: req.user._id, 
          userName: req.user.username,
          feedId: new Types.ObjectId(id)
        })
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
        body.toAddSubCommand({
          userId: req.user._id,
          userName: req.user.username,
          feedId: new Types.ObjectId(id),
          commentId: new Types.ObjectId(commentId),
        }),
      )
    }

    @Get(":id/comments")
    @UseGuards(BearerTokenGuard)
    @ApiBearerAuth("access-token")
    @ApiParam({name: "id", description: "피드 ID"})
    @ApiOkResponsePaginated(GetCommentResponse)
    async getComments(@Param("id") id: string, @Query() query: GetCommentRequest, @Req() req: Request): Promise<PaginationResponse<GetCommentResponse[]>> {
      const cmd = query.toQuery(new Types.ObjectId(id), req.user._id)

      return await this.feedCommentService.getComment(cmd)
    }


    @Get(":id/comments/:commentId/subComments")
    @UseGuards(BearerTokenGuard)
    @ApiBearerAuth("access-token")
    @ApiParam({ name: "id", description: "피드 ID" })
    @ApiParam({ name: "commentId", description: "댓글 ID" })
    @ApiOkResponsePaginated(GetSubCommentResponse)
    async getSubComment(
      @Query() query: GetSubCommentRequest,
      @Param("id") id: string,
      @Param("commentId") commentId: string,
      @Req() req: Request,
    ): Promise<PaginationResponse<GetSubCommentResponse[]>> {
      const q = query.toQuery(new Types.ObjectId(id), new Types.ObjectId(commentId), req.user._id)
      return await this.feedCommentService.getSubComments(q)
    }
  }