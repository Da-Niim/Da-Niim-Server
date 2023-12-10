import { Transform, Type } from "class-transformer"
import { IsNotEmpty, MaxLength } from "class-validator"
import { Location } from "./location.type"

export class FeedPostDto {
  @IsNotEmpty()
  @Type(() => String)
  name: string
  @IsNotEmpty()
  @MaxLength(500)
  @Type(() => String)
  content: string
  @Type(() => Array<string>)
  tag: string[]
  @IsNotEmpty()
  @Type(() => String)
  date: string
  @Transform(({ value }) => JSON.parse(value))
  location: Location
  @IsNotEmpty()
  @Type(() => Number)
  numOfPeople: number
  @IsNotEmpty()
  @Type(() => Number)
  expenses?: number

  constructor(
    name: string,
    content: string,
    tag: string[],
    date: string,
    location: Location,
    numOfPeople: number,
    expenses: number,
  ) {
    this.name = name
    this.content = content
    this.tag = tag
    this.date = date
    this.location = location
    this.numOfPeople = numOfPeople
    this.expenses = expenses
  }

  static fromJsonString(value: string): FeedPostDto {
    const feedPostDtoJson = JSON.parse(value)
    return new FeedPostDto(
      feedPostDtoJson.name,
      feedPostDtoJson.content,
      feedPostDtoJson.tag,
      feedPostDtoJson.date,
      feedPostDtoJson.location,
      feedPostDtoJson.numOfPeople,
      feedPostDtoJson.expenses,
    )
  }
}
