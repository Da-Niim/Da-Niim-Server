import { targetModulesByContainer } from "@nestjs/core/router/router-module";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { PaginationRequest } from "src/common/dto/pagination-request.dto";
import { FileUtils } from "src/common/utils/file.utils";
import { ImageEncoder } from "src/common/utils/image-encoder.utils";
import { GetProfileFeedCommand } from "src/feed/application/command/get-profile-feed.command";
import { Feed } from "src/feed/domain/feed.entity";
import { Photo } from "src/feed/domain/photo.model";

export class GetProfileFeedRequest extends PaginationRequest {
    target: Types.ObjectId

    async toCommand(userId: Types.ObjectId): Promise<GetProfileFeedCommand> {
        return new GetProfileFeedCommand({
            userId: userId,
            target: this.target,
            page: this.page,
            size: this.size
        })
    }
}


export class GetProfileFeedResponse {
    @ApiProperty({type: String, example: "65c2730ef8af3c6deec9befa"})
    id: Types.ObjectId
    @ApiProperty()
    photoUrl: string
    @ApiProperty()
    likeCount: number
    @ApiProperty()
    commentCount: number

    constructor(data: {id: Types.ObjectId, photoUrl: string, likeCount: number, commentCount: number}) {
        this.id = data.id
        this.photoUrl = data.photoUrl
        this.likeCount = data.likeCount
        this.commentCount = data.commentCount
    }

    static async of(feeds: Feed[], fileUtils: FileUtils): Promise<GetProfileFeedResponse[]> {
        return Promise.all(feeds.map(async (feed) => {
            return new GetProfileFeedResponse({
                id: feed._id,
                photoUrl: await fileUtils.getPublicUrl(feed.photos[0].storedFileName, "feed"),
                likeCount: feed.likeCount,
                commentCount: feed.commentCount
            })
        }))
    }
}