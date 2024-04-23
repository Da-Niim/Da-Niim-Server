import { Test } from "@nestjs/testing"

describe("Feed Controller", () => {
  it("Post Feed", () => {
    Test.createTestingModule({
      controllers: [FeedController],
    })
  })
})
