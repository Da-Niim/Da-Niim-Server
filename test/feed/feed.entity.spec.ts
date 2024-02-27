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
      // expect(
      //   () => new Feed({...input}),
      // ).toThrow()
    })
  });

  describe("like feed", () => {
    it("should increase 1 to likeCount", () => {
      const feed = new Feed({ likeCount: 0})
      feed.like()
      expect(feed.likeCount).toBe(1)
    })
  })

  describe("cancel feed like", () => {
    it("should decrease 1 to likeCount", () => {
      const feed = new Feed({ likeCount: 1})
      feed.cancelLike()
      expect(feed.likeCount).toBe(0)
    })
  })

  describe("add comment", () => {
    it("should increase 1 to commentCount", () => {
      const feed = new Feed({ commentCount: 0})
      feed.addComment()
      expect(feed.commentCount).toBe(1)
    })
  })


  describe("delete comment", () => {
    it("should decrease 1 to commentCount", () => {
      const feed = new Feed({ commentCount: 1})
      feed.deleteComment()
      expect(feed.commentCount).toBe(0)
    })
  })
})
