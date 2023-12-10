import { Body, Controller, Post } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserRegisterDto } from "./dto/user-register.dto"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("/register")
  registerUser(@Body() user: UserRegisterDto) {
    return this.userService.registerUser(user)
  }
}
