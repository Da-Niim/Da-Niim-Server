import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { AuthService } from "../auth.service"
import { UserRepository } from "src/user/repository/user.repository"

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const rawToken = request.headers["authorization"]
    if (!rawToken) throw new UnauthorizedException("토큰이 존재하지 않습니다.")
    const token = this.authService.extractTokenFromHeader(rawToken, true)
    const result = this.authService.verifyToken(token)
    const user = await this.userRepository.findOneUser(result.userId)
    request.user = user
    request.token = token
    request.tokenType = result.type
    return true
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)
    const request = context.switchToHttp().getRequest()
    if (request.tokenType !== "access")
      throw new UnauthorizedException("Access Token이 아닙니다..")
    return true
  }
}
@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)
    const request = context.switchToHttp().getRequest()
    if (request.tokenType !== "refresh")
      throw new UnauthorizedException("Refresh Token이 아닙니다..")
    return true
  }
}
