import { Types } from "mongoose"
import { Feed } from "src/feed/domain/feed.entity"
import { Photo } from "src/feed/domain/photo.model"

describe("Feed Entity", () => {
  describe("post", () => {
    it("should throw IllegalArgumentException if photos exists, but location does not exist", async () => {
      const input = {
        userId: Types.ObjectId.createFromTime(1),
        title: "title",
        content: "content",
        tag: ["tag1", "tag2"],
        date: "2020-12-12",
        numOfPeople: 10,
        photos: [new Photo("a", "a")],
        expenses: 10,
      }
      expect(
        () =>
          new Feed(
            input.userId,
            input.title,
            input.photos,
            input.content,
            input.tag,
            input.date,
            input.numOfPeople,
            input.expenses,
          ),
      ).toThrow()
    })
  })
})
