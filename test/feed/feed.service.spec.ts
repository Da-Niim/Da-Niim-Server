import { Test } from "@nestjs/testing"
import { Types } from "mongoose"
import { FeedRepository } from "src/feed/infra/feed.repository"
import { Readable } from "stream"
import { PostFeedRequest } from "src/feed/controller/dto/post-feed.dto"
import { PostFeedCommand } from "src/feed/application/command/post-feed.command"
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);


describe("FeedService", () => {
  let feedService: FeedService
  const mockCreatefn = jest.fn()
    .mockReturnValue({ _id: Types.ObjectId.generate() })

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FeedService],
    })
      .useMocker((token) => {
        if (token == FeedRepository) {
          return {
            create: mockCreatefn,
          }
        }
        else {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile()

    feedService = module.get<FeedService>(FeedService)
  })
  it("post", async () => {
    const userId = Types.ObjectId.createFromTime(1)
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
   
    await feedService.postFeed(cmd)

    expect(mockCreatefn).toBeCalled()
  })
})
