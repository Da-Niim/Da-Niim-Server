import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { ClientSession, Connection, Model, Types } from "mongoose"
import { User } from "../entity/user.entity"
import { UserRegisterDto } from "../dto/user-register.dto"
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

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec()
  }

  async updateUser(userId: string, updateUserDto: any): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec()
  }

  async deleteUser(userId: string): Promise<any> {
    return this.userModel.findByIdAndRemove(userId).exec()
  }

  async session(): Promise<ClientSession> {
    return this.userModel.db.startSession()
  }
  async setFollower(
    userId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): Promise<User> {
    const updatedTargetUser = await this.userModel
      .findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: userId },
      })
      .select(["_id"])
    return updatedTargetUser
  }
  async setFollowing(
    userId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): Promise<User> {
    const updateFollowing = await this.userModel
      .findByIdAndUpdate(userId, {
        $addToSet: { followings: targetUserId },
      })
      .select(["_id"])
    return updateFollowing
  }
  async setUnFollower(
    userId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId },
      })
      .select(["_id"])
  }
  async setUnFollowing(
    userId: Types.ObjectId,
    targetUserId: Types.ObjectId,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, {
        $pull: { followings: targetUserId },
      })
      .select(["_id"])
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
