import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  async hashingPassword(password: string) {
    const hashedPassword = bcrypt.hash(
      password,
      parseInt(this.configService.get<string>("HASH_ROUNDS")),
    )

    return hashedPassword
  }
}
