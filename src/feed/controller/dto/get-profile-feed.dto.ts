import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { PaginationRequest } from "src/common/dto/pagination-request.dto";
import { FileManager } from "src/common/utils/file.manager";
import { GetProfileFeedQuery } from "src/feed/application/query/get-profile-feed.query";
import { Feed } from "src/feed/domain/feed.entity";

export class GetProfileFeedRequest extends PaginationRequest {
    @ApiProperty({type: String})
    @IsNotEmpty()
    @Transform(({value}) => new Types.ObjectId(value))
    target: Types.ObjectId

    constructor(target?: Types.ObjectId) {
        super();
        this.target = target;
    }

    async toCommand(userId: Types.ObjectId): Promise<GetProfileFeedQuery> {
        return new GetProfileFeedQuery({
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

    static async of(feeds: Feed[], fileManager: FileManager): Promise<GetProfileFeedResponse[]> {
        return Promise.all(feeds.map(async (feed) => {
            return new GetProfileFeedResponse({
                id: feed._id,
                photoUrl: await fileManager.getPublicUrl(feed.photos[0].storedFileName, "feed"),
                likeCount: feed.likeCount,
                commentCount: feed.commentCount
            })
        }))
    }
}