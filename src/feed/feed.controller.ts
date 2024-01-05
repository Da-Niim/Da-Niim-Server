import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { Types } from "mongoose"
import { MultiImageFileValidationPipe } from "src/infra/file/file.multiImageFileValidation.pipe"
import { FeedPostRequest } from "./feed-post.dto"
import { FeedService } from "./feed.service"

@Controller("feeds")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
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
}
