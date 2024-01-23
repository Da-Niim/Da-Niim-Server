import { throws } from "assert";
import { Types } from "mongoose";
import { PaginationRequest } from "src/common/dto/pagination-request.dto";
import { FileUtils } from "src/common/utils/file.utils";
import { ImageEncoder } from "src/common/utils/image-encoder.utils";
import { User } from "src/user/entity/user.entity";
import { GetFeedCommand } from "../application/get-feed.command";
import { Feed } from "../domain/feed.entity";

export class GetFeedRequest extends PaginationRequest {
    order: string
    region: string
    hashtag: string

    async toCommand(userId: Types.ObjectId): Promise<GetFeedCommand> {
        return {
            userId: userId,
            order: this.order,
            region: this.region,
            hashtag: this.hashtag,
            page: this.page,
            size: this.size
        }
    }
}

export class GetFeedResponse {
    user: GetFeedResponseUser
    id: Types.ObjectId
    photoUrls: string[]
    title: string
    tags: string[]
    likeCount: number 
    commentCount: number
    like: boolean
    best: boolean

    constructor(feed: Feed, user: User) {
        this.user = {
            profileUrl: user.profileImage,
            name: user.username
        }
        this.id = feed._id
        this.photoUrls = feed.photos.map { (photo) => 
            const fileBuffer = await FileUtils.loadFile(photo.storedFileName) 
            ImageEncoder.encodeToBase64String(fileBuffer)
        }
    }
}
type GetFeedResponseUser = {
    profileUrl: string
    name: string
}