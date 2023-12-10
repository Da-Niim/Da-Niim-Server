import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { FeedModule } from "src/feed/feed.module"
import * as request from "supertest"

jest.mock("multer", () => {
  const multer = () => ({
    any: () => {
      return (req, res, next) => {
        req.files = [
          {
            originalname: "sample.png",
            mimetype: "image/png",
            path: "../resources/sample.png ",
            buffer: Buffer.from("fileBuffer"),
          },
        ]
        return next()
      }
    },
  })
  multer.memoryStorage = () => jest.fn()
  return multer
})

describe("Feed", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FeedModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it("/POST feeds", () => {
    const file = Buffer.from("fileBuffer")
    return request(app.getHttpServer())
      .post("/feeds")
      .send({
        name: "test",
        content: "content",
        tag: "tag1",
        date: "2020-12-12",
        location: {
          name: "location name",
          coord: {
            lat: 10,
            lng: 10,
          },
        },
        numOfPeople: 10,
        expenses: 10,
        files: [file],
      })
      .expect(201)
  })
})
