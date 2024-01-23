import { Feed } from "src/feed/domain/feed.entity"

describe("test", () => {
    it("print type", async () => {
        type FeedPrototype = typeof Feed.prototype
        const feedPrototype = {} as FeedPrototype
        console.log()
    })
})