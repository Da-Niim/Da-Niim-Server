import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "./entity/user.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createUser(user: User) {
    const isExistUserId = await this.userModel.exists({ userId: user.userId })
    if (isExistUserId)
      throw new BadRequestException("이미 존재하는 아이디입니다.")
    const isExistEmail = await this.userModel.exists({ email: user.email })
    if (isExistEmail)
      throw new BadRequestException("이미 존재하는 이메일입니다.")
    const isExistPhoneNumber = await this.userModel.exists({
      phoneNumber: user.phoneNumber,
    })
    if (isExistPhoneNumber)
      throw new BadRequestException("이미 존재하는 핸드폰 번호입니다.")

    const newUser = new this.userModel({
      ...user,
    })
    newUser.save()
    return newUser
  }
}
