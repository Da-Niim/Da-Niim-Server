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

  constructor(
    userId: Types.ObjectId,
    feedId: Types.ObjectId,
    content: string,
    parentId?: Types.ObjectId,
  ) {
    super()
    this.feedId = feedId
    this.userId = userId
    this.content = content
    this.likeCount = 0
    this.parentId = parentId
  }

  static fromQueryResult(
    result: FlattenMaps<FeedComment> & Require_id<{ _id: Types.ObjectId }>,
  ): FeedComment {
    const feedCommentEntity = new FeedComment(
      result.userId,
      result.feedId,
      result.content,
      result.parentId,
    )
    feedCommentEntity._id = result._id

    return feedCommentEntity
  }

  static create(
    userId: Types.ObjectId,
    feedId: Types.ObjectId,
    content: string,
  ): FeedComment {
    console.log("Create Feed Comment")
    return new FeedComment(userId, feedId, content, null)
  }

  addSubComment(userId: Types.ObjectId, content: string): FeedComment {
    return new FeedComment(userId, this.feedId, content, this._id)
  }
}

export const FeedCommentSchema = SchemaFactory.createForClass(FeedComment)
