import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { AbstractDocument } from "src/common/abstract.schema"
import { FileManager } from "src/common/utils/file.manager"
import { Location } from "../location.type"
import { AddressResolver } from "./address-resolver.service"
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

  static async create(data: {
    userId: Types.ObjectId
    title: string
    content: string
    tag: string[]
    date: string
    numOfPeople: number
    addressResolver: AddressResolver
    fileManager: FileManager
    files: Express.Multer.File[]
    expenses?: number
  }): Promise<Feed> {
    let location: Location
    const photos = await Photo.of("feed", data.files, data.fileManager)

    if (data.files && data.files.length > 0) {
      console.log("storedFilenName: ", photos[0].storedFileName)
      const photo = await data.fileManager.load(
        photos[0].storedFileName,
        "feed",
      )
      const coord = await data.addressResolver.resolveCoord(photo)

      location = {
        name: await data.addressResolver.resolveAddress(coord),
        coord: {
          lng: coord.lng,
          lat: coord.lat,
        },
      }
    }

    return new Feed({
      _id: null,
      userId: data.userId,
      title: data.title,
      photos: photos,
      content: data.content,
      tag: data.tag,
      date: data.date,
      location: location,
      numOfPeople: data.numOfPeople,
      likeCount: 0,
      commentCount: 0,
      expenses: data.expenses,
    })
  }

  like() {
    this.likeCount++
  }

  cancelLike() {
    this.likeCount--
  }

  addComment() {
    this.commentCount++
  }

  deleteComment() {
    this.commentCount--
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed)
