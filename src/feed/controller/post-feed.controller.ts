import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { Request } from "express"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { MultiImageFileValidationPipe } from "src/infra/file/file.multiImageFileValidation.pipe"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import { PostFeedService } from "../application/post-feed.service"
import { PostFeedRequest } from "@feed/request"

@Controller("feeds")
@ApiTags("feeds")
@UseGuards(BearerTokenGuard)
@ApiBearerAuth("access-token")
export class PostFeedController {
  constructor(private readonly postFeedService: PostFeedService) {}

  @ApiConsumes("multipart/form-data")
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
  @ApiBody({ type: PostFeedRequest })
  async postFeed(
    @Body() req: PostFeedRequest,
    @Req() httpRequest: Request,
    @UploadedFiles(new MultiImageFileValidationPipe())
    files?: { files: Express.Multer.File[] },
  ): Promise<any> {
    const cmd = await req.toCommand(httpRequest.user._id, files.files)
    const created = await this.postFeedService.postFeed(cmd)
    return { _id: created }
  }
}
