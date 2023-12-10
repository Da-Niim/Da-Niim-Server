import { UserRepository } from "./repository/user.repository"
import { BadRequestException, Injectable } from "@nestjs/common"

import { AuthService } from "src/auth/auth.service"
import { UserRegisterDto } from "./dto/user-register.dto"

@Injectable()
export class UserService {
  constructor(
    // @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}
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
    const hashedPassword = await this.authService.hashingPassword(user.password)

    const newUser = this.userRepository.registerUser({
      ...user,
      password: hashedPassword,
    })

    return newUser
  }
}
