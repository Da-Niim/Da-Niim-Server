import { UserRepository } from "./repository/user.repository"
import { BadRequestException, Injectable } from "@nestjs/common"
import { UserRegisterDto } from "./dto/user-register.dto"
import * as bcrypt from "bcrypt"
import { ConfigService } from "@nestjs/config"
import { ENV_HASH_ROUNDS_KEY } from "src/common/const/env-keys.const"
import { Request } from "express"
import { User } from "./entity/user.entity"
import { Types } from "mongoose"
import { serialize } from "v8"
import { FeedPostedEvent } from "src/feed/event/feed-posted-event"
import { OnEvent } from "@nestjs/event-emitter"
import { GetUserProfileInfoDto } from "./dto/get-user-profile-info.dto"

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}
  async hashingPassword(password: string) {
    const hashedPassword = bcrypt.hash(
      password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    )

    return hashedPassword
  }

  async registerUser(user: UserRegisterDto) {
    const isExistUserId = await this.userRepository.isExistUserId(user.userId)
    if (isExistUserId)
      throw new BadRequestException("이미 존재하는 아이디입니다.")
    const isExistEmail = await this.userRepository.isExistEmail(user.email)
    if (isExistEmail)
      throw new BadRequestException("이미 존재하는 이메일입니다.")
    const isExistPhoneNumber = await this.userRepository.isExistPhoneNumber(
      user.phoneNumber,
    )
    if (isExistPhoneNumber)
      throw new BadRequestException("이미 존재하는 핸드폰 번호입니다.")
    const hashedPassword = await this.hashingPassword(user.password)

    const newUser = new User({
      ...user,
      password: hashedPassword,
    })

    const registerUser = await this.userRepository.create(newUser)

    return { userId: registerUser.userId }
  }

  getUserInfo(requestDto: Request) {
    return {
      nickname: requestDto.user.nickname,
      profileImage: requestDto.user.profileImage,
    }
  }

  async getUserProfileInfo(userId: Types.ObjectId): Promise<GetUserProfileInfoDto> {
    const user = await this.userRepository.findOne({_id: userId})

    return new GetUserProfileInfoDto({
      name: user.nickname,
      profileUrl: user.profileImage,
      intro: user.intro,
      postCount: user.postCount,
      travelogCount: user.travelogCount,
      followerCount: user.followers.length,
      followingCount: user.followings.length
    })
  }

  @OnEvent("FeedPostedEvent")
  async onFeedPosted(event: FeedPostedEvent) {
    const user = await this.userRepository.findOne({_id: event.userId})

    user.postCount += 1

    this.userRepository.findOneAndUpdate({_id: event.userId}, user)
  }
}
