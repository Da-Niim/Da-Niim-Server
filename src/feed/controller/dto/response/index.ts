import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"
import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"
import { FeedLike } from "src/feed/domain/feed-like.entity"
import { Feed } from "src/feed/domain/feed.entity"
import { Photo } from "src/feed/domain/photo.model"
import { FileManager } from "src/infra/file/file.manager"
import { User } from "src/user/entity/user.entity"

export class GetCommentResponse {
  @ApiProperty({ description: "댓글 ID" })
  id: string
  @ApiProperty({ description: "작성자 이름" })
  author: string
  @ApiProperty({ description: "댓글 내용" })
  content: string
  @ApiProperty({ description: "좋아요 갯수" })
  likeCount: number
  @ApiProperty({ description: "댓글 개수" })
  commentCount: number
  @ApiProperty({ description: "내 댓글 여부" })
  own: boolean
  @ApiProperty({ description: "하위 댓글 여부" })
  hasSubComments: boolean

  constructor(data: {
    [P in keyof GetCommentResponse]: GetCommentResponse[P]
  }) {
    Object.assign(this, data)
  }

  static of(
    comments: Partial<FeedComment>[],
    userId: Types.ObjectId,
  ): GetCommentResponse[] {
    return comments.map((value) => {
      return {
        id: value._id.toString(),
        author: value.userName,
        content: value.content,
        likeCount: value.likeCount,
        commentCount: value.commentCount,
        own: userId.equals(value.userId),
        hasSubComments: value.commentCount > 0,
      }
    })
  }
}

class GetFeedResponseUser {
  @ApiProperty()
  profileUrl: string
  @ApiProperty()
  name: string

  constructor(data: { profileUrl: string; name: string }) {
    this.name = data.name
    this.profileUrl = data.profileUrl
  }
}

export class GetFeedResponse {
  @ApiProperty()
  user: GetFeedResponseUser
  @ApiProperty({ type: String, example: "65c2730ef8af3c6deec9befa" })
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
    return await Promise.all(
      feeds.map(async (feed) => {
        const source = new GetFeedResponse({
          user: new GetFeedResponseUser({
            profileUrl: user.profileImage,
            name: user.username,
          }),
          id: feed._id,
          photoUrls: await GetFeedResponse.mapToPhotoUrls(
            feed.photos,
            fileManager,
          ),
          title: feed.title,
          tags: feed.tag,
          likeCount: feed.likeCount,
          commentCount: feed.commentCount,
          like: await GetFeedResponse.checkIfLiked(feed._id, user._id, likes),
          best: best,
        })

        return source
      }),
    )
  }

  static async mapToPhotoUrls(
    photos: Photo[],
    fileManager: FileManager,
  ): Promise<string[]> {
    const promise = photos.map(async (photo) => {
      return await fileManager.getPublicUrl(photo.storedFileName, "feed")
    })
    return await Promise.all(promise)
  }

  static async checkIfLiked(
    feedId: Types.ObjectId,
    userId: Types.ObjectId,
    likes: FeedLike[],
  ): Promise<boolean> {
    const find = likes.find(
      (like) => like.feedId == feedId && like.userId == userId,
    )
    if (find) return true
    else return false
  }
}

export class GetProfileFeedResponse {
  @ApiProperty({ type: String, example: "65c2730ef8af3c6deec9befa" })
  id: Types.ObjectId
  @ApiProperty()
  photoUrl: string
  @ApiProperty()
  likeCount: number
  @ApiProperty()
  commentCount: number

  constructor(data: {
    id: Types.ObjectId
    photoUrl: string
    likeCount: number
    commentCount: number
  }) {
    this.id = data.id
    this.photoUrl = data.photoUrl
    this.likeCount = data.likeCount
    this.commentCount = data.commentCount
  }

  static async of(
    feeds: Feed[],
    fileManager: FileManager,
  ): Promise<GetProfileFeedResponse[]> {
    return Promise.all(
      feeds.map(async (feed) => {
        return new GetProfileFeedResponse({
          id: feed._id,
          photoUrl: await fileManager.getPublicUrl(
            feed.photos[0].storedFileName,
            "feed",
          ),
          likeCount: feed.likeCount,
          commentCount: feed.commentCount,
        })
      }),
    )
  }
}

export class GetSubCommentResponse {
  @ApiProperty({ description: "댓글 ID" })
  id: string
  @ApiProperty({ description: "작성자 이름" })
  author: string
  @ApiProperty({ description: "댓글 내용" })
  content: string
  @ApiProperty({ description: "좋아요 갯수" })
  likeCount: number
  @ApiProperty({ description: "내 댓글 여부" })
  own: boolean

  constructor(data: {
    [P in keyof GetSubCommentResponse]: GetSubCommentResponse[P]
  }) {
    Object.assign(this, data)
  }

  static of(
    comments: Partial<FeedComment>[],
    userId: Types.ObjectId,
  ): GetSubCommentResponse[] {
    return comments.map((value) => {
      return {
        id: value._id.toString(),
        author: value.userName,
        content: value.content,
        likeCount: value.likeCount,
        own: userId.equals(value.userId),
      }
    })
  }
}
