import { Inject, Injectable } from "@nestjs/common"
import { UserRepository } from "src/user/repository/user.repository"
import { FileManager } from "src/infra/file/file.manager"
import { FeedRepository } from "../infra/db/feed.repository"
import { FeedLikeRepository } from "../infra/db/feed-like.repository"
import { PaginationResponse } from "@types"
import { GetFeedResponse, GetProfileFeedResponse } from "@feed/response"
import { GetFeedQuery, GetProfileFeedQuery } from "./query"

@Injectable()
export class GetFeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
    private readonly userRepository: UserRepository,
    @Inject("fileManager") private readonly fileManager: FileManager,
  ) {}

  async getFeeds(
    cmd: GetFeedQuery,
  ): Promise<PaginationResponse<GetFeedResponse[]>> {
    const feeds = await this.feedRepository.findWithPagination(
      { page: cmd.page, size: cmd.size },
      null,
    )
    const totalElements = await this.feedRepository.count(null)
    const user = await this.userRepository.findOne({ _id: cmd.userId })
    const likes = await this.feedLikeRepository.find({
      userId: cmd.userId,
      feedId: { $in: feeds.map((feed) => feed._id) },
    })

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetFeedResponse.of(feeds, user, likes, false, this.fileManager, []),
    )
  }

  async getProfileFeeds(
    cmd: GetProfileFeedQuery,
  ): Promise<PaginationResponse<GetProfileFeedResponse[]>> {
    console.log("cmd", cmd)
    const filterQuery = { userId: cmd.target }
    const feeds = await this.feedRepository.findWithPagination(
      { page: cmd.page, size: cmd.size },
      filterQuery,
    )
    const totalElements = await this.feedRepository.count(filterQuery)

    return new PaginationResponse(
      cmd.page,
      cmd.size,
      totalElements,
      await GetProfileFeedResponse.of(feeds, this.fileManager),
    )
  }
}
