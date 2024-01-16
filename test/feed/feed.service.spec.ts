import { Test } from "@nestjs/testing"
import { Types } from "mongoose"
import { FeedPostRequest } from "src/feed/feed-post.dto"
import { FeedRepository } from "src/feed/infra/feed.repository"
import { FeedService } from "src/feed/application/feed.service"
import { Readable } from "stream"

describe("FeedService", () => {
  let feedService: FeedService
  const mockCreatefn = jest
    .fn()
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
      })
      .compile()

    feedService = module.get<FeedService>(FeedService)
  })
  it("post", async () => {
    const req: FeedPostRequest = new FeedPostRequest()
    const userId = Types.ObjectId.createFromTime(1)

    req.title = "title"
    req.content = "content"
    req.date = "2020-12-12"
    req.location = {
      name: "location name",
      coord: {
        lat: 10,
        lng: 10,
      },
    }
    req.expenses = 10
    req.numOfPeople = 10
    req.tag = ["tag"]

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

    await feedService.postFeed(userId, req, [file])

    expect(mockCreatefn).toBeCalled()
  })
})
