import { Inject, Injectable } from "@nestjs/common"
import { FeedRepository } from "../infra/feed.repository"
import { FeedLikeRepository } from "../infra/feed-like.repository"
import { UserRepository } from "src/user/repository/user.repository"
import { PaginationResponse } from "src/common/dto/pagination-response.dto"
import { GetFeedResponse } from "../controller/dto/get-feeds.dto"
import { GetProfileFeedResponse } from "../controller/dto/get-profile-feed.dto"
import { FileManager } from "src/infra/file/file.manager"
import { GetFeedQuery } from "./query/get-feed.query"
import { GetProfileFeedQuery } from "./query/get-profile-feed.query"

@Injectable()
export class GetFeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
    private readonly userRepository: UserRepository,
    @Inject("fileManager") private readonly fileManager: FileManager,
  ) {}

  async getFeeds(cmd: GetFeedQuery): Promise<PaginationResponse<GetFeedResponse[]>> {
    const feeds = await this.feedRepository.findWithPagination(cmd.page, cmd.size, null)
    const totalElements = await this.feedRepository.count(null)
    const user = await this.userRepository.findOne({_id: cmd.userId})
    const likes = await this.feedLikeRepository.find({userId: cmd.userId, feedId: { $in: feeds.map((feed) => feed._id)}})

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetFeedResponse.of(feeds, user, likes, false, this.fileManager, [])
    )
  }

  async getProfileFeeds(cmd: GetProfileFeedQuery): Promise<PaginationResponse<GetProfileFeedResponse[]>> {
    console.log("cmd", cmd)
    const filterQuery = { userId: cmd.target }
    const feeds = await this.feedRepository.findWithPagination(cmd.page, cmd.size, filterQuery)
    const totalElements = await this.feedRepository.count(filterQuery)

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetProfileFeedResponse.of(feeds, this.fileManager)
    )
  }
}
