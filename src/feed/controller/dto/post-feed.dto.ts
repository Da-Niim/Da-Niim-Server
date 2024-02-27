import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDateString, IsNotEmpty, MaxLength } from "class-validator"
import { Types } from "mongoose"
import { RequireImageException } from "src/common/exceptions/require-image.exception"
import { PostFeedCommand } from "src/feed/application/command/post-feed.command"

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
