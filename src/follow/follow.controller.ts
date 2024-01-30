import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { FollowService } from "./follow.service"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { Request } from "express"
import { FollowDto } from "./dto/follow.dto"

@Controller("follow")
export class FollowController {
  constructor(private readonly followService: FollowService) {}
  @Post("/")
  @UseGuards(BearerTokenGuard)
  async followUser(@Body() data: FollowDto, @Req() requestDto: Request) {
    return await this.followService.followUser(data, requestDto)
  }

  @Post("/cancel")
  @UseGuards(BearerTokenGuard)
  unFollowUser(@Body() data: FollowDto, @Req() requestDto: Request) {
    try {
      return this.followService.unFollowUser(data, requestDto)
    } catch (error) {
      return error
    }
  }
  @Get("/")
  @UseGuards(BearerTokenGuard)
  getFollowList(@Req() requestDto: Request) {
    return this.followService.getFollowList(requestDto)
  }
}
