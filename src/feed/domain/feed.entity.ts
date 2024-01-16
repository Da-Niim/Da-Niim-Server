import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { FlattenMaps, HydratedDocument, Require_id, Types } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { Photo } from "../../common/photo.model"
import { Location } from "../location.type"
import { AddressResolver } from "./address-resolver.service"
import { FeedComment } from "./feed-comment.entity"
import { FeedLike } from "./feed-like.entity"

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
  @Prop({ type: Object })
  location: Location
  @Prop({ required: true })
  numOfPeople: number
  @Prop()
  expenses?: number
  @Prop({ type: Number, required: true })
  likeCount: number

  constructor(
    userId: Types.ObjectId,
    title: string,
    photos: Photo[],
    content: string,
    tag: string[],
    date: string,
    location: Location,
    numOfPeople: number,
    likeCount: number,
    _id?: Types.ObjectId,
    expenses?: number,
  ) {
    super()
    this._id = _id
    this.userId = userId
    this.title = title
    this.photos = photos
    this.content = content
    this.tag = tag
    this.date = date
    this.location = location
    this.numOfPeople = numOfPeople
    this.expenses = expenses
    this.likeCount = likeCount
  }

  static async create(
    userId: Types.ObjectId,
    title: string,
    content: string,
    tag: string[],
    date: string,
    numOfPeople: number = 1,
    likeCount: number,
    addressResolver: AddressResolver,
    files: Express.Multer.File[],
    expenses?: number,
  ): Promise<Feed> {
    let location: Location

    if (files.length > 0) {
      const coord = addressResolver.resolveCoord(files[0])

      location = {
        name: await addressResolver.resolveAddress(coord),
        coord: {
          lng: coord.lng,
          lat: coord.lat,
        },
      }
    }

    return new Feed(
      userId,
      title,
      Photo.of(files),
      content,
      tag,
      date,
      location,
      numOfPeople,
      likeCount,
      null,
      expenses,
    )
  }

  static fromQueryResult(
    result: FlattenMaps<Feed> & Require_id<{ _id: Types.ObjectId }>,
  ): Feed {
    const feedEntity = new Feed(
      result.userId,
      result.title,
      result.photos,
      result.content,
      result.tag,
      result.date,
      result.location,
      result.numOfPeople,
      result.likeCount,
      result._id,
      result.expenses,
    )
    feedEntity._id = result._id

    return feedEntity
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
