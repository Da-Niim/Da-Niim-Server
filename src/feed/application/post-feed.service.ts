import { Inject, Injectable } from "@nestjs/common"
import { Feed } from "../domain/feed.entity"
import { AddressResolver } from "../domain/address-resolver.service"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { PostFeedCommand } from "./command/post-feed.command"
import { FileManager } from "src/infra/file/file.manager"
import { FeedPostedEvent } from "../event/feed-posted-event"
import { FeedRepository } from "../infra/db/feed.repository"

@Injectable()
export class PostFeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject("fileManager") private readonly fileManager: FileManager,
    @Inject("addressResolverImpl")
    private readonly addressResolver: AddressResolver,
  ) {}

  async postFeed(cmd: PostFeedCommand): Promise<string> {
    const feed: Feed = await Feed.create({
      userId: cmd.userId,
      title: cmd.title,
      content: cmd.content,
      tag: cmd.tag,
      date: cmd.date,
      numOfPeople: cmd.numOfPeople,
      addressResolver: this.addressResolver,
      fileManager: this.fileManager,
      files: cmd.files,
      expenses: cmd.expenses,
    })
    const saved = await this.feedRepository.create(feed)

    this.eventEmitter.emit(
      "FeedPostedEvent",
      new FeedPostedEvent({ userId: cmd.userId }),
    )

    return saved._id.toString()
  }
}
