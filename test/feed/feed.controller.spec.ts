import { Test } from "@nestjs/testing"
import { FeedController } from "src/feed/controller/feed.controller"

describe("Feed Controller", () => {
  it("Post Feed", () => {
    Test.createTestingModule({
      controllers: [FeedController],
    })
  })
})
