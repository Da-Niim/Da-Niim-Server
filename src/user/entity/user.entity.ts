import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import {
  IsEmail,
  IsPhoneNumber,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator"
import { Types } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { AlreadyFollowingException } from "src/follow/already-following.exception"
import { UserGender } from "../const/user.gender.const"

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  constructor(userProps: Omit<User, keyof typeof User.prototype>) {
    super()
    Object.assign(this, userProps)
  }
  @Prop({ required: true })
  userId: string

  @MinLength(2, { message: "이름은 최소 2자 이상이어야 합니다." })
  @MaxLength(6, { message: "이름은 최대 6자 이하여야 합니다." })
  @Prop({ required: true })
  username: string

  @MinLength(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
  @MaxLength(10, { message: "닉네임은 최대 10자 이하여야 합니다." })
  @Prop({ required: true })
  nickname: string

  @IsEmail()
  @Prop({ required: true })
  email: string

  @MinLength(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
  @MaxLength(20, { message: "비밀번호는 최대 20자 이하여야 합니다." })
  @Matches(/[\W_]+/, {
    message: "비밀번호에는 최소 한 개 이상의 특수문자가 포함되어야 합니다.",
  })
  @Prop({ required: true })
  password: string

  @IsPhoneNumber("KR", { message: "핸드폰 번호 형식이 올바르지 않습니다." })
  @Matches(/^\d{3}-\d{4}-\d{4}$/, {
    message: "핸드폰 번호 형식은 000-0000-0000 형식이어야 합니다.",
  })
  @Prop({ required: true })
  phoneNumber: string

  @Prop({ required: true, type: String, enum: UserGender })
  gender: UserGender

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "생년월일은 YYYY-MM-DD 형식이어야 합니다.",
  })
  @Prop({ required: true })
  birthDate: string

  @Prop({ required: false, default: null })
  profileImage?: string

  @Prop([{ type: Array<Types.ObjectId>, ref: "User" }])
  followers: Types.ObjectId[]

  @Prop([{ type: Array<Types.ObjectId>, ref: "User" }])
  followings: Types.ObjectId[]

  @Prop({ required: false, default: null })
  intro?: string

  @Prop({required: true, default: 0})
  postCount: number

  @Prop({required: true, default: 0})
  travelogCount: number

  async follow(targetUser: User) {
    const isIncludeFollowing = this.followings.some((e) =>
      e.equals(targetUser._id),
    )

    const isIncludeFollower = targetUser.followers.some((e) =>
      e.equals(this._id),
    )
    if (isIncludeFollowing || isIncludeFollower)
      throw new AlreadyFollowingException()
    this.followings.push(targetUser._id)
    targetUser.followers.push(this._id)
  }
  async unFollow(targetUser: User) {
    this.followings = this.followings.filter((id) => {
      id !== targetUser._id
    })
    targetUser.followers = targetUser.followers.filter((id) => {
      id !== this._id
    })
  }
}

export const UserSchema = SchemaFactory.createForClass(User)
