import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"
import { Request } from "express"
import { Types } from "mongoose"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { ApiOkResponsePaginated } from "src/common/decorators/api-pagination-response.decorator"
import { PaginationResponse } from "src/common/dto/pagination-response.dto"
import { MultiImageFileValidationPipe } from "src/infra/file/file.multiImageFileValidation.pipe"
import { User } from "src/user/entity/user.entity"
import { FeedCommentService } from "../application/feed-comment.service"
import { FeedLikeService } from "../application/feed-like.service"
import { FeedService } from "../application/feed.service"
import { AddCommentRequest } from "./dto/add-comment.request"
import { GetFeedRequest, GetFeedResponse } from "./dto/get-feeds.dto"
import {
  GetProfileFeedRequest,
  GetProfileFeedResponse,
} from "./dto/get-profile-feed.dto"
import { PostFeedRequest } from "./dto/post-feed.dto"

@Controller("feeds")
@ApiTags("feeds")
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly feedLikeService: FeedLikeService,
    private readonly feedCommentService: FeedCommentService,
  ) {}

  @ApiConsumes("multipart/form-data")
  @Post()
  @UseGuards(BearerTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: "files",
        maxCount: 10,
      },
    ]),
  )
  @ApiBody({ type: PostFeedRequest })
  @ApiBearerAuth("access-token")
  async postFeed(
    @Body() req: PostFeedRequest,
    @Req() httpRequest: Request,
    @UploadedFiles(new MultiImageFileValidationPipe())
    files?: { files: Express.Multer.File[] },
  ): Promise<any> {
    const cmd = await req.toCommand(httpRequest.user._id, files.files)
    const created = await this.feedService.postFeed(cmd)
    return { _id: created }
  }

  @Get()
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  @ApiOkResponsePaginated(GetFeedResponse)
  async getFeeds(
    @Query() query: GetFeedRequest,
    @Req() req: Request,
  ): Promise<PaginationResponse<GetFeedResponse[]>> {
    return await this.feedService.getFeeds(await query.toCommand(req.user._id))
  }

  @Get("/profile")
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  @ApiOkResponsePaginated(GetProfileFeedResponse)
  async getProfileFeeds(
    @Query() query: GetProfileFeedRequest,
    @Req() req: Request,
  ): Promise<PaginationResponse<GetProfileFeedResponse[]>> {
    const user = req.user
    return await this.feedService.getProfileFeeds(
      await query.toCommand(user._id),
    )
  }

  @Post(":id/like")
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  @ApiParam({ name: "id", description: "피드 ID" })
  async likeFeed(@Param("id") id: string, @Req() req: Request) {
    const user: User = req.user
    await this.feedLikeService.likeFeed(user._id, new Types.ObjectId(id))
  }

  @Delete(":id/like")
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  async cancelFeedLike(@Param("id") id: string, @Req() req: Request) {
    const user: User = req.user
    await this.feedLikeService.cancelLikeFeed({
      userId: user._id,
      feedId: new Types.ObjectId(id),
    })
  }

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
