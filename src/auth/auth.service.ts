import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { User } from "src/user/entity/user.entity"
import { UserRepository } from "src/user/repository/user.repository"
import { UserLoginDto } from "./dto/user-login.dto"
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from "src/common/const/env-keys.const"

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}
  async hashingPassword(password: string) {
    const hashedPassword = bcrypt.hash(
      password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    )

    return hashedPassword
  }

  async authenticatePassword(
    submittedPassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(submittedPassword, hashedPassword)
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    if (!header) throw new UnauthorizedException("토큰이 존재하지 않습니다.")
    const splitToken = header.split(" ")
    const prefix = isBearer ? "Bearer" : "Basic"
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException("토큰이 올바르지 않습니다.")
    }
    const token = splitToken[1]
    return token
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, "base64").toString("utf8")
    if (decoded.split(":").length !== 2)
      throw new UnauthorizedException("토큰이 올바르지 않습니다.")
    const [userId, password] = decoded.split(":")
    return { userId, password }
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      })
    } catch (e) {
      throw new UnauthorizedException("토큰이 만료되었거나 잘못된 토큰입니다.")
    }
  }
  signToken(user: Pick<User, "_id" | "userId">, isRefreshToken: boolean) {
    const payload = {
      email: user.userId,
      sub: user._id,
      type: isRefreshToken ? "refresh" : "access",
    }
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      //seconds
      expiresIn: isRefreshToken ? 43200 : 3600,
    })
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token)
    if (decoded.type !== "refresh" && isRefreshToken) {
      throw new UnauthorizedException("올바르지 않은 토큰입니다.")
    }
    return this.signToken({ ...decoded }, isRefreshToken)
  }
  issuanceToken(user: Pick<User, "_id" | "userId">) {
    const accessToken = this.signToken(user, false)
    const refreshToken = this.signToken(user, true)
    return {
      accessToken,
      refreshToken,
    }
  }
  async loginUser(user: UserLoginDto) {
    const existUser = await this.userRepository.findOneUser(user.userId)
    if (!existUser) throw new BadRequestException("존재하지 않는 아이디입니다.")
    const isOk = await this.authenticatePassword(
      user.password,
      existUser.password,
    )

    if (!isOk) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.")
    }
    return this.issuanceToken(existUser)
  }
}
