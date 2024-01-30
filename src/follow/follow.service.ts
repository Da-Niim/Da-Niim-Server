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
      const currentUser = await this.userRepository.mapToDomain(User, await this.userRepository.findOne({_id }))
      const targetUser = await this.userRepository.mapToDomain(User, await this.userRepository.findOne({_id: targetUserId}))

      currentUser.follow(targetUser)

      this.userRepository.upsert({_id}, currentUser)
      this.userRepository.upsert({_id: targetUserId}, targetUser)
      
      return "Follow Success"
    } catch (error) {
      throw error
    }
  }
  // async unFollowUser(data: FollowDto, requestDto: Request): Promise<string> {
  //   const { targetUserId } = data
  //   const {
  //     user: { _id },
  //   } = requestDto
  //   try {
  //     const isSuccess = this.userRepository.unFollow(_id, targetUserId)
  //     if (!isSuccess) throw new Error("UnFollow Fail")
  //     return "UnFollow Success"
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // async getFollowList(requestDto: Request): Promise<any> {
  //   const { user } = requestDto
  //   const followings = await this.userRepository.getFollowings(user._id)
  //   const followers = await this.userRepository.getFollowers(user._id)
  //   return { followings, followers }
  // }
}
