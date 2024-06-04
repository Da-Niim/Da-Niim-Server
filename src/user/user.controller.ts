import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserRegisterDto } from "./dto/user-register.dto"
import { BearerTokenGuard } from "src/auth/guard/bearer-token.guard"
import { Request } from "express"
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger"
import { GetUserProfileInfoDto } from "./dto/get-user-profile-info.dto"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("/register")
  registerUser(@Body() user: UserRegisterDto) {
    return this.userService.registerUser(user)
  }

  @Get("info")
  @UseGuards(BearerTokenGuard)
  getUserInfo(@Req() requestDto: Request) {
    return this.userService.getUserInfo(requestDto)
  }

  @Get("/me/info/profile")
  @UseGuards(BearerTokenGuard)
  @ApiBearerAuth("access-token")
  @ApiOkResponse({ type: GetUserProfileInfoDto })
  getUserProfileInfo(@Req() req: Request): Promise<GetUserProfileInfoDto> {
    return this.userService.getUserProfileInfo(req.user._id)
  }
}
