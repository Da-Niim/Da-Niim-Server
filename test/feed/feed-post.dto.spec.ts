import { ArgumentMetadata, ValidationPipe } from "@nestjs/common"
import { generate } from "randomstring"
import { PostFeedRequest } from "src/feed/controller/dto/post-feed.dto"

describe("FeedPostDto", () => {
  let validationPipe: ValidationPipe
  let metadata: ArgumentMetadata
  beforeEach(() => {
    validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    })
    metadata = {
      type: "body",
      metatype: PostFeedRequest,
      data: "",
    }
  })
  it("should validate fields", async () => {
    try {
      await validationPipe.transform(
        <PostFeedRequest>{
          title: "",
          content: "",
          date: "",
          tag: ["tag1", "tag2"],
        },
        metadata,
      )
    } catch (err) {
      expect(err.getResponse().statusCode).toBe(400)
      expect(err.getResponse().message).toStrictEqual([
        "title should not be empty",
        "content should not be empty",
        "date must be a valid ISO 8601 date string",
        "date should not be empty",
        "numOfPeople should not be empty",
        "expenses should not be empty",
      ])
    }
  })

  it("should not have content longer than 500 chars", async () => {
    try {
      await validationPipe.transform(
        <PostFeedRequest>{
          title: "test",
          content: generate(501),
          tag: ["test"],
          date: "2020-12-12",
          numOfPeople: 10,
          expenses: 0,
        },
        metadata,
      )
    } catch (err) {
      expect(err.getResponse().statusCode).toBe(400)
      expect(err.getResponse().message).toStrictEqual([
        "content must be shorter than or equal to 500 characters",
      ])
    }
  })

  it("should not have non-ISO 8601 type date", async () => {
    try {
      await validationPipe.transform(
        <PostFeedRequest>{
          title: "test",
          content: "content",
          tag: ["test"],
          date: "zzz",
          numOfPeople: 10,
          expenses: 0,
        },
        metadata,
      )
    } catch (err) {
      expect(err.getResponse().statusCode).toBe(400)
      expect(err.getResponse().message).toStrictEqual([
        "date must be a valid ISO 8601 date string",
      ])
    }
  })
})
