import { Controller, Headers, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  loginUser(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const credentials = this.authService.decodeBasicToken(token)

    return this.authService.loginUser(credentials)
  }
  @Post("/token/access")
  // @UseGuards(RefreshTokenGuard)
  createTokenAccess(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true)
    const newToken = this.authService.rotateToken(token, false)
    return { accessToken: newToken }
  }

  @Post("/token/refresh")
  // @UseGuards(RefreshTokenGuard)
  createTokenRefresh(@Headers("authorization") rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true)
    const newToken = this.authService.rotateToken(token, true)
    return { refreshToken: newToken }
  }
}
