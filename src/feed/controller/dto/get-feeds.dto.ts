import { ApiProperty } from "@nestjs/swagger";
import { throws } from "assert";
import { Types } from "mongoose";
import { PaginationRequest } from "src/common/dto/pagination-request.dto";
import { PaginationResponse } from "src/common/dto/pagination-response.dto";
import { FileManager } from "src/common/utils/file.manager";
import { ImageEncoder } from "src/common/utils/image-encoder.utils";
import { GetFeedCommand } from "src/feed/application/command/get-feed.command";
import { FeedLike } from "src/feed/domain/feed-like.entity";
import { Feed } from "src/feed/domain/feed.entity";
import { Photo } from "src/feed/domain/photo.model";
import { User } from "src/user/entity/user.entity";

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

class GetFeedResponseUser {
    @ApiProperty()
    profileUrl: string
    @ApiProperty()
    name: string

    constructor(data: {profileUrl: string, name: string}) {
        this.name = data.name
        this.profileUrl = data.profileUrl
    }
}

export class GetFeedResponse {
    @ApiProperty()
    user: GetFeedResponseUser
    @ApiProperty({type: String, example: "65c2730ef8af3c6deec9befa"})
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
        fileManager: FileManager,
        properties: string[],
        ): Promise<any[]> {
            return await Promise.all(feeds.map(async (feed) => {
                const source = new GetFeedResponse({
                    user: new GetFeedResponseUser({
                        profileUrl: user.profileImage,
                        name: user.username
                    }),
                    id: feed._id,
                    photoUrls: await GetFeedResponse.mapToPhotoUrls(feed.photos, fileManager),
                    title: feed.title,
                    tags: feed.tag,
                    likeCount: feed.likeCount,
                    commentCount: feed.commentCount,
                    like: await GetFeedResponse.checkIfLiked(feed._id, user._id, likes),
                    best: best
                })
                // const extracted = {}
                // if(properties.length > 0) {
                //     for(const prop of properties) {
                //         if(source.hasOwnProperty(prop)) {
                //             extracted[prop] = source[prop]
                //         }
                //     }
                // }

                return source
            }))      
    }

    static async mapToPhotoUrls(photos: Photo[], fileManager: FileManager): Promise<string[]> {
        const promise = photos.map(async (photo) => {
            return await fileManager.getPublicUrl(photo.storedFileName, "feed")
        })
        return await Promise.all(promise)
    }

    static async checkIfLiked(feedId: Types.ObjectId, userId: Types.ObjectId, likes: FeedLike[]): Promise<boolean> {
        const find = likes.find((like) => like.feedId == feedId && like.userId == userId)
        if(find) return true
        else return false
    }
}