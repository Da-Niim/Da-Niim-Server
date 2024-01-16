import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsDateString, IsNotEmpty, MaxLength } from "class-validator"
import { Location } from "./location.type"

export class FeedPostRequest {
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

  @IsNotEmpty()
  @Type(() => String)
  @IsDateString()
  @ApiProperty({ type: "string", example: "2023-04-01" })
  date: string

  // @Transform(({ value }) => JSON.parse(value))
  // @ApiProperty()
  // location: Location

  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ type: "number", example: 2 })
  numOfPeople: number

  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ type: "number", example: 250000 })
  expenses?: number

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  files?: Express.Multer.File[]
}
