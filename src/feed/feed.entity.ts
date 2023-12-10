import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { requireArgument } from "src/common/validation-utils"
import { Photo } from "../common/photo.model"
import { Location } from "./location.type"

export type FeedDocument = HydratedDocument<Feed>

@Schema()
export class Feed extends AbstractDocument {
  @Prop({ required: true })
  name: string
  @Prop()
  photos: Photo[]
  @Prop({ required: true })
  content: string
  @Prop([String])
  tag: string[]
  @Prop({ required: true })
  date: string
  @Prop({ type: Object })
  location: Location
  @Prop({ required: true })
  numOfPeople: number
  @Prop()
  expenses?: number

  constructor(
    name: string,
    content: string,
    tag: string[],
    date: string,
    numOfPeople: number = 1,
    photos?: Photo[],
    expenses?: number,
    location?: Location,
  ) {
    requireArgument(
      photos != undefined ? location != undefined : true,
      "사진을 첨부한 경우 위치를 입력해야 합니다.",
    )

    super()
    this.name = name
    this.photos = photos
    this.content = content
    this.tag = tag
    this.date = date
    this.location = location
    this.numOfPeople = numOfPeople
    this.expenses = expenses
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed)
