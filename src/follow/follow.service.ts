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
    const { user } = requestDto

    try {
      const following = await this.userRepository.setFollowing(
        user._id,
        targetUserId,
      )
      const follower = await this.userRepository.setFollower(
        user._id,
        targetUserId,
      )
      console.log("following", following)
      console.log("follower", follower)
      return "OK"
    } catch (error) {
      throw error
    }
  }
  async unFollowUser(data: FollowDto, requestDto: Request): Promise<User> {
    const { targetUserId } = data
    const { user } = requestDto
    try {
      await this.userRepository.setUnFollowing(user._id, targetUserId)
      const updatedTargetUser = await this.userRepository.setUnFollower(
        targetUserId,
        user._id,
      )
      return updatedTargetUser
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
