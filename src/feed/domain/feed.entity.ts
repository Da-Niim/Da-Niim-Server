import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { plainToInstance } from "class-transformer"
import { FlattenMaps, HydratedDocument, Require_id, Types } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { Location } from "../location.type"
import { AddressResolver } from "./address-resolver.service"
import { FeedComment } from "./feed-comment.entity"
import { FeedLike } from "./feed-like.entity"
import { Photo } from "./photo.model"

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
  @Prop({required: false})
  expenses?: number
  @Prop({ type: Number, required: true })
  likeCount: number

  constructor(feedProps: Omit<Feed, keyof typeof Feed.prototype>) {
    super()
    Object.assign(this, feedProps)
  }

  static async create(
    userId: Types.ObjectId,
    title: string,
    content: string,
    tag: string[],
    date: string,
    numOfPeople: number = 1,
    addressResolver: AddressResolver,
    files: Express.Multer.File[],
    expenses?: number,
  ): Promise<Feed> {
    let location: Location
    let photos = await Photo.of(files)

    if (files && files.length > 0) {
      const coord = await addressResolver.resolveCoord(files[0])

      location = {
        name: await addressResolver.resolveAddress(coord),
        coord: {
          lng: coord.lng,
          lat: coord.lat,
        },
      }
    }

    return new Feed({
      userId: userId,
      title: title,
      photos: photos,
      content: content,
      tag: tag,
      date: date,
      location: location,
      numOfPeople: numOfPeople,
      likeCount: 1,
      expenses: expenses,
    })
  }

  static async fromQueryResult(
    result: FlattenMaps<Feed> & Require_id<{ _id: Types.ObjectId }>,
  ): Promise<Feed> {
    return plainToInstance(Feed, result)
  }

  addLike(userId: Types.ObjectId): FeedLike {
    this.likeCount += 1
    return new FeedLike(this._id, userId)
  }

  retractLike() {
    this.likeCount -= 1
  }

  addComment(content: string, userId: Types.ObjectId): FeedComment {
    return new FeedComment(userId, this._id, content, null)
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed)
