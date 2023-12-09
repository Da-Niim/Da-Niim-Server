import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { UserService } from "src/user/user.service"
import * as bcrypt from "bcrypt"
import { UserRegisterDto } from "./dto/user-register.dto"
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async registerUser(user: UserRegisterDto) {
    const hashedPassword = await bcrypt.hash(
      user.password,
      this.configService.get<string>("SALT_ROUND"),
    )

    const newUser = await this.usersService.createUser({
      ...user,
      password: hashedPassword,
    })
    return newUser
  }
}
