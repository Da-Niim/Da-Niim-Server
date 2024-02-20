import { ApiProduces, ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty } from "class-validator"
import { Types } from "mongoose"
import { AddCommentCommand } from "../../application/command/add-comment.command"
import { AddSubCommentCommand } from "../../application/command/add-subcomment.command"

export class AddCommentRequest {
  @IsNotEmpty({ message: "댓글 내용을 입력해주세요." })
  @Type(() => String)
  @ApiProperty({ type: "string", example: "댓글 내용" })
  content: string

  toAddCommand(
    userId: Types.ObjectId,
    feedId: Types.ObjectId,
  ): AddCommentCommand {
    return {
      userId: userId,
      feedId: feedId,
      content: this.content,
    }
  }

  toAddSubCommand(
    userId: Types.ObjectId,
    feedId: Types.ObjectId,
    commentId: Types.ObjectId,
  ): AddSubCommentCommand {
    return {
      userId: userId,
      feedId: feedId,
      content: this.content,
      commentId: commentId,
    }
  }
}
