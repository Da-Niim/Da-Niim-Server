import { Injectable } from "@nestjs/common"

import { UserRepository } from "src/user/repository/user.repository"
import { FollowDto } from "./dto/follow.dto"
import { Request } from "express"
import { User } from "src/user/entity/user.entity"
import { Types } from "mongoose"

@Injectable()
export class FollowService {
  constructor(private readonly userRepository: UserRepository) {}
  async followUser(data: FollowDto, requestDto: Request): Promise<string> {
    const { targetUserId } = data
    const {
      user: { _id },
    } = requestDto

    try {
      const currentUser = new User(await this.userRepository.findOne({ _id }))
      const targetUser = new User(
        await this.userRepository.findOne({
          _id: targetUserId,
        }),
      )

      await currentUser.follow(targetUser)

      this.userRepository.upsert({ _id }, currentUser)
      this.userRepository.upsert({ _id: targetUserId }, targetUser)

      return "Follow Success"
    } catch (error) {
      throw error
    }
  }
  async unFollowUser(data: FollowDto, requestDto: Request): Promise<string> {
    const { targetUserId } = data
    const {
      user: { _id },
    } = requestDto
    try {
      const currentUser = new User(await this.userRepository.findOne({ _id }))
      const targetUser = new User(
        await this.userRepository.findOne({
          _id: targetUserId,
        }),
      )

      await currentUser.unFollow(targetUser)

      this.userRepository.upsert({ _id }, currentUser)
      this.userRepository.upsert({ _id: targetUserId }, targetUser)

      return "UnFollow Success"
    } catch (error) {
      throw error
    }
  }
  async getFollowList(requestDto: Request): Promise<{
    followings: Types.ObjectId[]
    followers: Types.ObjectId[]
  }> {
    const {
      user: { _id },
    } = requestDto
    const currentUser = new User(await this.userRepository.findOne({ _id }))

    return {
      followings: currentUser.followings,
      followers: currentUser.followers,
    }
  }
}
