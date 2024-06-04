import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { Photo } from "src/feed/domain/photo.model"

export type FeedDocument = HydratedDocument<Feed>

@Schema()
export class Feed extends AbstractDocument {
  @Prop({ required: true })
  userId: Types.ObjectId
  @Prop({ required: true })
  title: string
  @Prop()
  photos: Photo[]
  @Prop({ required: true })
  content: string
  @Prop([String])
  tag: string[]
  @Prop({ required: true })
  date: string
  @Prop({ type: Object, required: false })
  location?: Location
  @Prop({ required: false })
  numOfPeople?: number
  @Prop({ required: false })
  expenses?: number
  @Prop({ type: Number, required: true })
  likeCount: number
  @Prop({ type: Number, required: true })
  commentCount: number

  constructor(feedProps: Partial<Feed>) {
    super()
    Object.assign(this, feedProps)
    this._id = feedProps._id
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed)
