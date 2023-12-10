import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "./entity/user.entity"
import { AuthModule } from "src/auth/auth.module"
import { UserRepository } from "./repository/user.repository"

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
