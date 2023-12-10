import { PickType } from "@nestjs/swagger"
import { User } from "../../user/entity/user.entity"

export class UserRegisterDto extends PickType(User, [
  "userId",
  "email",
  "password",
  "phoneNumber",
  "gender",
  "birthDate",
  "username",
]) {}
