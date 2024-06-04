import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { ApiOkResponsePaginated } from "src/common/decorators/api-pagination-response.decorator"
import { GetFeedService } from "../application/get-feed.service"
import { PaginationResponse } from "src/common/types"
import { GetFeedResponse, GetProfileFeedResponse } from "@feed/response"
import { GetFeedRequest, GetProfileFeedRequest } from "@feed/request"

@Controller("feeds")
@ApiTags("feeds")
export class GetFeedController {
  constructor(private readonly getFeedService: GetFeedService) {}

  @Get()
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  @ApiOkResponsePaginated(GetFeedResponse)
  async getFeeds(
    @Query() query: GetFeedRequest,
    @Req() req: Request,
  ): Promise<PaginationResponse<GetFeedResponse[]>> {
    return await this.getFeedService.getFeeds(
      await query.toCommand(req.user._id),
    )
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
    return await this.getFeedService.getProfileFeeds(
      await query.toCommand(user._id),
    )
  }
}
