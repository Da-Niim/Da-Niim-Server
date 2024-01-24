import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Connection, Model, Types } from "mongoose"
import { User } from "../entity/user.entity"
import { AbstractRepository } from "src/common/abstract.repository"

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  logger: Logger

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection)
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

  async getFollowings(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const user = await this.userModel
      .findById(userId)
      .populate("followings")
      .exec()

    return user.followings
  }
  async getFollowers(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const user = await this.userModel
      .findById(userId)
      .populate("followers")
      .exec()

    return user.followers
  }
}
