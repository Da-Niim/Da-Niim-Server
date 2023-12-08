import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "./entity/user.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  register() {
    const user = new this.userModel({
      userId: "test",
      username: "test",
      email: "test",
      password: "test",
      phoneNumber: "test",
      gender: "MALE",
      birthDate: "test",
    })
    user.save()
    return user
  }
}
