import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import {
  FlattenMaps,
  HydratedDocument,
  Require_id,
  SchemaTypes,
  Types,
} from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"

export type FeedCommentDocument = HydratedDocument<FeedComment>

@Schema({ timestamps: true })
export class FeedCommentDBEntity extends AbstractDocument {
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

  constructor(feedCommentProps: Partial<FeedCommentDBEntity>) {
    super()
    Object.assign(this, feedCommentProps)
  }

  static fromDomain(domain: FeedComment): FeedCommentDBEntity {
    return new FeedCommentDBEntity(domain)
  }

  toDomain(): FeedComment {
    return new FeedComment(this)
  }
}

export const FeedCommentSchema = SchemaFactory.createForClass(FeedComment)
