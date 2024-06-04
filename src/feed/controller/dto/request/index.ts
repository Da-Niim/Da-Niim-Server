import {
  AddCommentCommand,
  AddSubCommentCommand,
  PostFeedCommand,
} from "@feed/command"
import {
  GetCommentQuery,
  GetFeedQuery,
  GetProfileFeedQuery,
  GetSubCommentQuery,
} from "@feed/query"
import { ApiProperty } from "@nestjs/swagger"
import { PaginationRequest } from "@types"
import { Transform, Type } from "class-transformer"
import { IsDateString, IsNotEmpty, MaxLength } from "class-validator"
import { Types } from "mongoose"
import { RequireImageException } from "src/common/exceptions/require-image.exception"

export class AddCommentRequest {
  @IsNotEmpty({ message: "댓글 내용을 입력해주세요." })
  @Type(() => String)
  @ApiProperty({ type: "string", example: "댓글 내용" })
  content: string

  toAddCommand(data: {
    userId: Types.ObjectId
    userName: string
    feedId: Types.ObjectId
  }): AddCommentCommand {
    return {
      userId: data.userId,
      userName: data.userName,
      feedId: data.feedId,
      content: this.content,
    }
  }

  toAddSubCommand(data: {
    userId: Types.ObjectId
    userName: string
    feedId: Types.ObjectId
    commentId: Types.ObjectId
  }): AddSubCommentCommand {
    return {
      userId: data.userId,
      userName: data.userName,
      feedId: data.feedId,
      content: this.content,
      commentId: data.commentId,
    }
  }
}

export class GetCommentRequest extends PaginationRequest {
  toQuery(feedId: Types.ObjectId, userId: Types.ObjectId): GetCommentQuery {
    return {
      page: this.page,
      size: this.size,
      feedId: feedId,
      userId: userId,
    }
  }
}

export class GetFeedRequest extends PaginationRequest {
  order: string
  region: string
  hashtag: string

  async toCommand(userId: Types.ObjectId): Promise<GetFeedQuery> {
    return {
      userId: userId,
      order: this.order,
      region: this.region,
      hashtag: this.hashtag,
      page: this.page,
      size: this.size,
    }
  }
}

export class GetProfileFeedRequest extends PaginationRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  target: Types.ObjectId

  async toCommand(userId: Types.ObjectId): Promise<GetProfileFeedQuery> {
    return new GetProfileFeedQuery({
      userId: userId,
      target: this.target ? new Types.ObjectId(this.target) : null,
      page: this.page,
      size: this.size,
    })
  }
}

export class GetSubCommentRequest extends PaginationRequest {
  toQuery(
    feedId: Types.ObjectId,
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
  ): GetSubCommentQuery {
    return {
      page: this.page,
      size: this.size,
      feedId: feedId,
      commentId: commentId,
      userId: userId,
    }
  }
}

export class PostFeedRequest {
  @IsNotEmpty()
  @Type(() => String)
  @ApiProperty({ type: "string", example: "제목" })
  title: string

  @IsNotEmpty()
  @MaxLength(500)
  @Type(() => String)
  @ApiProperty({ type: "string", example: "내용" })
  content: string

  @Type(() => Array<string>)
  @ApiProperty({
    type: "array",
    items: { type: "string", example: "tag1, tag2" },
  })
  tag: string[]

  @Type(() => String)
  @IsDateString()
  @ApiProperty({ type: "string", example: "2023-04-01", required: false })
  date?: string

  // @Transform(({ value }) => JSON.parse(value))
  // @ApiProperty()
  // location: Location

  @Type(() => Number)
  @ApiProperty({ type: "number", example: 2, required: false })
  numOfPeople?: number

  @Type(() => Number)
  @ApiProperty({ type: "number", example: 250000, required: false })
  expenses?: number

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  files?: Express.Multer.File[]

  async toCommand(
    userId: Types.ObjectId,
    files?: Express.Multer.File[],
  ): Promise<PostFeedCommand> {
    if (!files) throw new RequireImageException()
    return {
      userId: userId,
      title: this.title,
      content: this.content,
      tag: this.tag,
      date: this.date,
      numOfPeople: this.numOfPeople,
      expenses: this.expenses,
      files: files,
    }
  }
}
