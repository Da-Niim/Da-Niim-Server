import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import {
  FlattenMaps,
  HydratedDocument,
  Require_id,
  SchemaTypes,
  Types,
} from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"

export type FeedCommentDocument = HydratedDocument<FeedComment>

@Schema({ timestamps: true })
export class FeedComment extends AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: Types.ObjectId
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  feedId: Types.ObjectId
  @Prop({ type: String, required: true })
  content: string
  @Prop({ type: SchemaTypes.ObjectId, required: false })
  parentId?: Types.ObjectId
  @Prop({ type: Number, required: true })
  likeCount: number

  constructor(feedCommentProps: Partial<FeedComment>) {
    super()
    Object.assign(this, feedCommentProps)
  }

  addSubComment(userId: Types.ObjectId, content: string): FeedComment {
    return new FeedComment({
      userId: userId, 
      feedId: this.feedId, 
      content: content, 
      parentId: this._id,
      likeCount: 0
    })
  }
}

export const FeedCommentSchema = SchemaFactory.createForClass(FeedComment)
