import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { UserGender } from "../const/user.gender.const"
import {
  IsEmail,
  IsPhoneNumber,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator"
import { AbstractDocument } from "src/common/abstract.schema"
import { FlattenMaps, Require_id, Types } from "mongoose"
import { plainToClass, plainToClassFromExist, plainToInstance, TransformPlainToInstance } from "class-transformer"

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

  @Prop([{ type: Types.ObjectId, ref: "User" }])
  followers: Types.ObjectId[]

  @Prop([{ type: Types.ObjectId, ref: "User" }])
  followings: Types.ObjectId[]

  addFollower(followerId: Types.ObjectId) {
    const isInclude = this.followers.includes(followerId)
    if (!isInclude) this.followers.push(followerId)
    return
  }
  removeFollower(followerId: Types.ObjectId) {
    this.followers = this.followers.filter((id) => id !== followerId)
  }
  addFollowing(followingId: Types.ObjectId) {
    const isInclude = this.followings.includes(followingId)
    if (!isInclude) this.followings.push(followingId)
    return
  }
  removeFollowing(followingId: Types.ObjectId) {
    this.followings = this.followings.filter((id) => id !== followingId)
  }

  async follow(targetUser: User) {
    this.followings.push(targetUser._id)
    targetUser.followers.push(this._id)
  }
}

export const UserSchema = SchemaFactory.createForClass(User)
