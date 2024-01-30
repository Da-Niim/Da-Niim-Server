import { ApiProperty } from "@nestjs/swagger";
import { throws } from "assert";
import { Types } from "mongoose";
import { PaginationRequest } from "src/common/dto/pagination-request.dto";
import { PaginationResponse } from "src/common/dto/pagination-response.dto";
import { FileUtils } from "src/common/utils/file.utils";
import { ImageEncoder } from "src/common/utils/image-encoder.utils";
import { User } from "src/user/entity/user.entity";
import { GetFeedCommand } from "../application/get-feed.command";
import { FeedLike } from "../domain/feed-like.entity";
import { Feed } from "../domain/feed.entity";
import { Photo } from "../domain/photo.model";

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
    @ApiProperty()
    user: GetFeedResponseUser
    @ApiProperty()
    id: Types.ObjectId
    @ApiProperty()
    photoUrls: string[]
    @ApiProperty()
    title: string
    @ApiProperty()
    tags: string[]
    @ApiProperty()
    likeCount: number 
    @ApiProperty()
    commentCount: number
    @ApiProperty()
    like: boolean
    @ApiProperty()
    best: boolean

    constructor(props: GetFeedResponse) {
        Object.assign(this, props)
    }

    static async of(
        feeds: Feed[], 
        user: User, 
        likes: FeedLike[], 
        best: boolean, 
        commentCount: number): Promise<GetFeedResponse[]> {
            return await Promise.all(feeds.map(async (feed) => {
                return new GetFeedResponse({
                    user: {
                        profileUrl: user.profileImage,
                        name: user.username
                    },
                    id: feed._id,
                    photoUrls: await GetFeedResponse.mapToPhotoUrls(feed.photos),
                    title: feed.title,
                    tags: feed.tag,
                    likeCount: feed.likeCount,
                    commentCount: commentCount,
                    like: await GetFeedResponse.checkIfLiked(feed._id, user._id, likes),
                    best: best
                })
            }))      
    }

    static async mapToPhotoUrls(photos: Photo[]): Promise<string[]> {
        const promise = photos.map(async (photo) => {
            const fileBuffer = await FileUtils.loadFile(photo.storedFileName) 
            return ImageEncoder.encodeToBase64String(fileBuffer)
        })
        return await Promise.all(promise)
    }

    static async checkIfLiked(feedId: Types.ObjectId, userId: Types.ObjectId, likes: FeedLike[]): Promise<boolean> {
        const find = likes.find((like) => like.feedId == feedId && like.userId == userId)
        if(find) return true
        else return false
    }
}
type GetFeedResponseUser = {
    profileUrl: string
    name: string
}