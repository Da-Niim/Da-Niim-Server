import { Injectable } from "@nestjs/common"

import { UserRepository } from "src/user/repository/user.repository"
import { FollowDto } from "./dto/follow.dto"
import { Request } from "express"
import { User } from "src/user/entity/user.entity"

@Injectable()
export class FollowService {
  constructor(private readonly userRepository: UserRepository) {}
  async followUser(data: FollowDto, requestDto: Request): Promise<string> {
    const { targetUserId } = data
    const {
      user: { _id },
    } = requestDto

    try {
      const targetUser = await User.mapToDomain(
        await this.userRepository.findOne({
          _id: targetUserId,
        }),
      )
      const currentUser = await User.mapToDomain(
        await this.userRepository.findOne({ _id }),
      )
      targetUser.addFollower(currentUser._id)
      currentUser.addFollowing(targetUserId)
      this.userRepository.upsert({ _id: targetUser._id }, targetUser)
      this.userRepository.upsert({ _id }, currentUser)
      return "OK"
    } catch (error) {
      throw error
    }
  }
  async unFollowUser(data: FollowDto, requestDto: Request): Promise<string> {
    const { targetUserId } = data
    const { user } = requestDto
    try {
      const targetUser = await this.userRepository.findOne({
        _id: targetUserId,
      })
      targetUser.removeFollower(user._id)
      user.removeFollowing(targetUserId)
      return "updatedTargetUser"
    } catch (error) {
      throw error
    }
  }
  async getFollowList(requestDto: Request): Promise<any> {
    const { user } = requestDto
    const followings = await this.userRepository.getFollowings(user._id)
    const followers = await this.userRepository.getFollowers(user._id)
    return { followings, followers }
  }
}
