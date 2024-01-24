import { ApiProperty } from "@nestjs/swagger"
import mongoose from "mongoose"

export class FollowDto {
  @ApiProperty({
    description: "상대 유저의 _id",
    example: "60f1f5b9e6b3f3b3d8a5e8b1",
  })
  targetUserId: mongoose.Types.ObjectId
}
