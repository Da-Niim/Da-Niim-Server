import { UserRepository } from "./repository/user.repository"
import { BadRequestException, Injectable } from "@nestjs/common"
import { UserRegisterDto } from "./dto/user-register.dto"
import * as bcrypt from "bcrypt"
import { ConfigService } from "@nestjs/config"
import { ENV_HASH_ROUNDS_KEY } from "src/common/const/env-keys.const"
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,

    private readonly configService: ConfigService,
  ) {}
  async hashingPassword(password: string) {
    const hashedPassword = bcrypt.hash(
      password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    )

    return hashedPassword
  }

  async registerUser(user: UserRegisterDto) {
    const isExistUserId = await this.userRepository.isExistUserId(user.userId)
    if (isExistUserId)
      throw new BadRequestException("이미 존재하는 아이디입니다.")
    const isExistEmail = await this.userRepository.isExistEmail(user.email)
    if (isExistEmail)
      throw new BadRequestException("이미 존재하는 이메일입니다.")
    const isExistPhoneNumber = await this.userRepository.isExistPhoneNumber(
      user.phoneNumber,
    )
    if (isExistPhoneNumber)
      throw new BadRequestException("이미 존재하는 핸드폰 번호입니다.")
    const hashedPassword = await this.hashingPassword(user.password)

    const newUser = await this.userRepository.registerUser({
      ...user,
      password: hashedPassword,
    })

    return { userId: newUser.userId }
  }
}
