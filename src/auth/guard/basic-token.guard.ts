/**
 * 구현할 기능
 * 1. 요청 객체를 불러오고 authorization header로부터 토큰을 추출한다.
 * 2. authService.extractTokenFromHeader()를 통해 토큰을 추출한다.
 * 3. authService.decodeBasicToken()을 통해 토큰을 디코딩하여 email, password를 추출한다
 * 4. authService.authenticateWithEmailAndPassword()를 통해 email, password를 검증한다.
 * 5. 검증이 완료되면 사용자 정보를 1번의 요청 객체에 붙여준다.
 *   - req.user = user;
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { AuthService } from "../auth.service"

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const rawToken = request.headers["authorization"]
    if (!rawToken) throw new UnauthorizedException("토큰이 존재하지 않습니다.")
    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const credentials = this.authService.decodeBasicToken(token)
    const user = await this.authService.loginUser(credentials)
    request.user = user
    return true
  }
}
