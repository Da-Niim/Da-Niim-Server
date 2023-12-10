import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { BodyInterceptor } from "src/common/interceptors/bodyFieldParse.interceptor"
import { MultiImageFileValidationPipe } from "src/infra/file/file.multiImageFileValidation.pipe"
import { FeedPostDto } from "./feed-post.dto"
import { FeedService } from "./feed.service"

@Controller("feeds")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseInterceptors(
    BodyInterceptor,
    FileFieldsInterceptor([
      {
        name: "files",
        maxCount: 10,
      },
    ]),
  )
  async postFeed(
    @Body() req: FeedPostDto,
    @UploadedFiles(new MultiImageFileValidationPipe())
    files: { files: Express.Multer.File[] },
  ): Promise<string> {
    await this.feedService.postFeed(req, files.files)
    return "success"
  }
}
