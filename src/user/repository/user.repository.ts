import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { User } from "../entity/user.entity"
import { UserRegisterDto } from "../dto/user-register.dto"

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // 사용자 생성
  async registerUser(userData: UserRegisterDto): Promise<User> {
    const newUser = new this.userModel({
      _id: new Types.ObjectId(),
      ...userData,
    })
    return newUser.save()
  }

  async isExistUserId(userId: string) {
    return await this.userModel.exists({
      userId,
    })
  }

  async isExistPhoneNumber(phoneNumber: string) {
    return await this.userModel.exists({
      phoneNumber,
    })
  }

  async isExistEmail(email: string) {
    return await this.userModel.exists({
      email,
    })
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOneUser(userId: string): Promise<User> {
    return this.userModel.findOne({ userId }).exec()
  }

  async updateUser(userId: string, updateUserDto: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec()
  }

  async deleteUser(userId: string): Promise<any> {
    return this.userModel.findByIdAndRemove(userId).exec()
  }
}
