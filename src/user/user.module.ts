import { Module, forwardRef } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "./entity/user.entity"
import { UserRepository } from "./repository/user.repository"
import { AuthModule } from "src/auth/auth.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
