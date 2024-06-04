import { Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { User } from "../entity/user.entity"
import { AbstractRepository } from "src/common/abstract.repository"

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  logger: Logger

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel, User)
    this.logger = new Logger(UserRepository.name)
  }

  async isExistUserById(userId: Types.ObjectId) {
    return await this.userModel.exists({
      _id: userId,
    })
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
    return await this.userModel.find().exec()
  }

  async findOneUser(userId: string): Promise<User> {
    return await this.userModel.findOne({ userId }).exec()
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec()
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
