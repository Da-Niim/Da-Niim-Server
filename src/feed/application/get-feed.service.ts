import { Inject, Injectable } from "@nestjs/common"
import { FeedRepository } from "../infra/feed.repository"
import { FeedLikeRepository } from "../infra/feed-like.repository"
import { FeedCommentRepository } from "../infra/feed-comment.repository"
import { AddressResolver } from "../domain/address-resolver.service"
import { UserRepository } from "src/user/repository/user.repository"
import { GetFeedCommand } from "./command/get-feed.command"
import { PaginationResponse } from "src/common/dto/pagination-response.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { GetFeedResponse } from "../controller/dto/get-feeds.dto"
import { GetProfileFeedCommand } from "./command/get-profile-feed.command"
import { GetProfileFeedResponse } from "../controller/dto/get-profile-feed.dto"
import { FileManager } from "src/common/utils/file.manager"

@Injectable()
export class GetFeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedLikeRepository: FeedLikeRepository,
    private readonly userRepository: UserRepository,
    @Inject("fileUtilsImpl") private readonly fileManager: FileManager,
  ) {}

  async getFeeds(cmd: GetFeedCommand): Promise<PaginationResponse<GetFeedResponse[]>> {
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

  async getProfileFeeds(cmd: GetProfileFeedCommand): Promise<PaginationResponse<GetProfileFeedResponse[]>> {
    const filterQuery = { userId: cmd.userId }
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
