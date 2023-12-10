import { Photo } from "src/common/photo.model"
import { Readable } from "stream"

describe("Photo Model", () => {
  const file: Express.Multer.File = {
    originalname: "photo1.png",
    filename: "storename.png",
    mimetype: "applcation/octet-stream",
    path: "something",
    buffer: Buffer.from("one,two,three"),
    fieldname: "",
    encoding: "",
    size: 0,
    stream: new Readable(),
    destination: "",
  }
  describe("of", () => {
    it("return Photo[]", async () => {
      const result: Photo[] = await Photo.of([file])
      const photo = result[0]
      expect(photo.originalFileName).toBe("photo1.png")
      expect(photo.storedFileName).toBe("storename.png")
    })
  })
})
