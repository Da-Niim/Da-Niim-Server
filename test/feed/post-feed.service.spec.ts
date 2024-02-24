import { EventEmitter2 } from "@nestjs/event-emitter"
import { getModelToken } from "@nestjs/mongoose"
import { Test } from "@nestjs/testing"
import { Types } from "mongoose"
import { rejects } from "node:assert"
import { Readable } from "node:stream"
import { FileManager } from "src/common/utils/file.manager"
import { SupabaseFileUtils } from "src/common/utils/supabase-file.manager"
import { PostFeedCommand } from "src/feed/application/command/post-feed.command"
import { PostFeedService } from "src/feed/application/post-feed.service"
import { AddressResolver } from "src/feed/domain/address-resolver.service"
import { Feed, FeedSchema } from "src/feed/domain/feed.entity"
import { AddressResolverImpl } from "src/feed/infra/address-resolver.service.impl"
import { FeedRepository } from "src/feed/infra/feed.repository"

describe("FeedService", () => {
    let postFeedService: PostFeedService
    let fileManager: FileManager
    let addressResolver: AddressResolver
    let feedRepository: FeedRepository

    const mockCreatefn = jest.fn()
      .mockReturnValue({ _id: Types.ObjectId.generate() })
  
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
            PostFeedService, 
            FeedRepository,
            {
              provide: getModelToken(Feed.name),
              useValue: FeedSchema
            },
            EventEmitter2,
            {
                provide: "fileUtilsImpl",
                useClass: SupabaseFileUtils
            },
            {
                provide: "addressResolverImpl",
                useClass: AddressResolverImpl
            },
        ],
      }).compile()
  
      postFeedService = module.get<PostFeedService>(PostFeedService)
      fileManager = module.get<FileManager>("fileUtilsImpl")
      addressResolver = module.get<AddressResolver>("addressResolverImpl")
      feedRepository = module.get<FeedRepository>(FeedRepository)
    })
    it("post", async () => {
      const userId = new Types.ObjectId()
      const file: Express.Multer.File = {
        originalname: "photo.png",
        fieldname: "storename.png",
        encoding: "",
        mimetype: "",
        size: 0,
        stream: new Readable(),
        destination: "",
        filename: "",
        path: "",
        buffer: undefined,
      }
     
      const cmd: PostFeedCommand = {
        userId: userId,
        title: "title",
        content: "content",
        date: "2020-12-12",
        expenses: 10,
        numOfPeople: 10,
        tag: ["tag"],
        files: [file]
      }
      const feed = new Feed({
        _id: userId, ...cmd
      })

      console.log("userId: ", userId)

      jest.spyOn(fileManager, 'save').mockImplementation()
      jest.spyOn(fileManager, 'load').mockImplementation()
      jest.spyOn(addressResolver, 'resolveAddress').mockReturnValueOnce(new Promise((resolve, reject) => resolve("MOCK_ADDRESS")))
      jest.spyOn(addressResolver, 'resolveCoord').mockReturnValueOnce(new Promise((resolve, reject) => resolve({lng: 10, lat: 10})))
      jest.spyOn(feedRepository, 'create').mockReturnValueOnce(new Promise((resolve, reject) => resolve(feed)))

      await postFeedService.postFeed(cmd)
    })
  })
  