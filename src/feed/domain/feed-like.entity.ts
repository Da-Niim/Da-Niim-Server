import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, SchemaTypes, Types } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"

export type FeedLikeDocument = HydratedDocument<FeedLike>

@Schema()
export class FeedLike extends AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  feedId: Types.ObjectId
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: Types.ObjectId

  constructor(data: {feedId: Types.ObjectId, userId: Types.ObjectId}) {
    super()
    this.feedId = data.feedId
    this.userId = data.userId
  }
}

export const FeedLikeSchema = SchemaFactory.createForClass(FeedLike)
