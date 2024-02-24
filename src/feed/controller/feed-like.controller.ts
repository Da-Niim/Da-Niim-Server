import {
    Controller,
    Delete,
    Param,
    Post,
    Req,
    UseGuards,
  } from "@nestjs/common"
  import { Request } from "express"
  import { Types } from "mongoose"
  import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
  import { User } from "src/user/entity/user.entity"
  import {
    ApiBearerAuth,
    ApiParam,
    ApiTags,
  } from "@nestjs/swagger"
  import { FeedLikeService } from "../application/feed-like.service"
  
  @Controller("feeds")
  @ApiTags("feeds")
  export class FeedLikeController {
    constructor(
      private readonly feedLikeService: FeedLikeService) {}
  
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
        feedId: new Types.ObjectId(id)})
    }
  }