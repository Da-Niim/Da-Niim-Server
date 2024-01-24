import { PickType } from "@nestjs/swagger"
import { User } from "../entity/user.entity"

export class UserRegisterDto extends PickType(User, [
  "userId",
  "email",
  "password",
  "phoneNumber",
  "gender",
  "birthDate",
  "username",
  "nickname",
]) {}
