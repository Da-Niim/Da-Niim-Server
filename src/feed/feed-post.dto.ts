import { Transform, Type } from "class-transformer"
import { IsDateString, IsNotEmpty, MaxLength } from "class-validator"
import { Location } from "./location.type"

export class FeedPostRequest {
  @IsNotEmpty()
  @Type(() => String)
  title: string
  @IsNotEmpty()
  @MaxLength(500)
  @Type(() => String)
  content: string
  @Type(() => Array<string>)
  tag: string[]
  @IsNotEmpty()
  @Type(() => String)
  @IsDateString()
  date: string
  @Transform(({ value }) => JSON.parse(value))
  location: Location
  @IsNotEmpty()
  @Type(() => Number)
  numOfPeople: number
  @IsNotEmpty()
  @Type(() => Number)
  expenses?: number
}
