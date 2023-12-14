import { PickType } from "@nestjs/swagger"
import { User } from "src/user/entity/user.entity"

export class UserLoginDto extends PickType(User, ["userId", "password"]) {}
