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
import { SchemaTypes, Types } from "mongoose"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { MultiImageFileValidationPipe } from "src/infra/file/file.multiImageFileValidation.pipe"
import { User } from "src/user/entity/user.entity"
import { FeedPostRequest } from "./feed-post.dto"
import { FeedService } from "./feed.service"

@Controller("feeds")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

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
  async postFeed(
    @Body() req: FeedPostRequest,
    @UploadedFiles(new MultiImageFileValidationPipe())
    files: { files: Express.Multer.File[] },
  ): Promise<any> {
    const created = await this.feedService.postFeed(
      Types.ObjectId.createFromTime(1),
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
  async likeFeed(@Param("id") id: string, @Req() req: Request) {
    const user: User = req.user

    await this.feedService.likeFeed(user._id, new Types.ObjectId(id))
  }
}
