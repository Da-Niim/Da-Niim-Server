import { Injectable } from "@nestjs/common"

import { UserRepository } from "src/user/repository/user.repository"
import { FollowDto } from "./dto/follow.dto"
import { Request } from "express"

@Injectable()
export class FollowService {
  constructor(private readonly userRepository: UserRepository) {}
  async followUser(data: FollowDto, requestDto: Request): Promise<string> {
    const { targetUserId } = data
    const {
      user: { _id },
    } = requestDto

    try {
      const isSuccess = this.userRepository.follow(_id, targetUserId)
      if (!isSuccess) throw new Error("Follow Fail")
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
      const isSuccess = this.userRepository.unFollow(_id, targetUserId)
      if (!isSuccess) throw new Error("UnFollow Fail")
      return "UnFollow Success"
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
