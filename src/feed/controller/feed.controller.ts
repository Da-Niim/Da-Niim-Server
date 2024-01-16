import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { Request } from "express"
import { Types } from "mongoose"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { MultiImageFileValidationPipe } from "src/infra/file/file.multiImageFileValidation.pipe"
import { User } from "src/user/entity/user.entity"
import { FeedPostRequest } from "../feed-post.dto"
import { FeedService } from "../application/feed.service"
import { AddCommentRequest } from "./add-comment.request"
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger"

@Controller("feeds")
@ApiTags("feeds")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

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
  @ApiBody({ type: FeedPostRequest })
  @ApiBearerAuth("access-token")
  async postFeed(
    @Body() req: FeedPostRequest,
    @UploadedFiles(new MultiImageFileValidationPipe())
    files: { files: Express.Multer.File[] },
    @Req() httpRequest: Request,
  ): Promise<any> {
    const created = await this.feedService.postFeed(
      httpRequest.user._id,
      req,
      files.files,
    )
    return { _id: created }
  }

  @Get(":id")
  async getFeed(@Param("id") id: string) {
    await this.feedService.getFeed("test")
  }

  @Post(":id/like")
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  @ApiParam({ name: "id", description: "피드 ID" })
  async likeFeed(@Param("id") id: string, @Req() req: Request) {
    const user: User = req.user
    console.log(user._id)
    await this.feedService.likeFeed(user._id, new Types.ObjectId(id))
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
    await this.feedService.addComment(
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
    await this.feedService.addSubComment(
      body.toAddSubCommand(
        req.user._id,
        new Types.ObjectId(id),
        new Types.ObjectId(commentId),
      ),
    )
  }
}
