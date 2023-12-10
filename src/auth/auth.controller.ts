import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { UserService } from "src/user/user.service"
import { UserRegisterDto } from "./dto/user-register.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post("/register")
  registerUser(@Body() user: UserRegisterDto) {
    return this.authService.registerUser(user)
  }
}
