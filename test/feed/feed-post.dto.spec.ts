import { ArgumentMetadata, ValidationPipe } from "@nestjs/common"
import { FeedPostDto } from "src/feed/feed-post.dto"
import { generate } from "randomstring"

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
      metatype: FeedPostDto,
      data: "",
    }
  })
  it("should validate fields", async () => {
    const input = {
      name: "",
      content: "",
      tag: ["test"],
      date: "",
      location: {},
    }

    try {
      await validationPipe.transform(input, metadata)
    } catch (err) {
      expect(err.getResponse().statusCode).toBe(400)
      expect(err.getResponse().message).toStrictEqual([
        "name should not be empty",
        "content should not be empty",
        "date should not be empty",
        "numOfPeople should not be empty",
        "expenses should not be empty",
      ])
    }
  })

  it("should not have content longer than 500 chars", async () => {
    const input = {
      name: "test",
      content: generate(501),
      tag: ["test"],
      date: "2020-12-12",
      numOfPeople: 10,
      expenses: 0,
      location: {},
    }

    try {
      await validationPipe.transform(input, metadata)
    } catch (err) {
      expect(err.getResponse().statusCode).toBe(400)
      expect(err.getResponse().message).toStrictEqual([
        "content must be shorter than or equal to 500 characters",
      ])
    }
  })
})
