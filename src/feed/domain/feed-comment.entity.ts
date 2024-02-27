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
  @Prop({ type: String, required: true })
  userName: string
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  feedId: Types.ObjectId
  @Prop({ type: String, required: true })
  content: string
  @Prop({ type: SchemaTypes.ObjectId, required: false })
  parentId?: Types.ObjectId
  @Prop({ type: Number, required: true })
  likeCount: number
  @Prop({ type: Number, required: true })
  commentCount: number

  constructor(feedCommentProps: Partial<FeedComment>) {
    super()
    Object.assign(this, feedCommentProps)
  }

  static async create(data: { content: string, feedId: Types.ObjectId, userId: Types.ObjectId, userName: string }): Promise<FeedComment> {
    return new FeedComment({
      userId: data.userId,
      userName: data.userName,
      feedId: data.feedId,
      content: data.content,
      likeCount: 0,
      commentCount: 0
    })
  }

  addSubComment(userId: Types.ObjectId, userName: string, content: string): FeedComment {
    this.commentCount++
    
    return new FeedComment({
      userId: userId, 
      userName: userName,
      feedId: this.feedId, 
      content: content, 
      parentId: this._id,
      likeCount: 0,
      commentCount: 0
    })
  }
}

export const FeedCommentSchema = SchemaFactory.createForClass(FeedComment)
