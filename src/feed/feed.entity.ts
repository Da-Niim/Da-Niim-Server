import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
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
    photos: Photo[],
    content: string,
    tag: string[],
    date: string,
    location: Location,
    numOfPeople: number,
    expenses?: number,
  ) {
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
