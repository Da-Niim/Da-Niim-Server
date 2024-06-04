import { IllegalArgumentException } from "./../../../src/common/exceptions/illegal-argument.exception"
import { AWSS3FileManager } from "src/infra/file/aws-s3-file.manager"

describe("AWS S3 File Manager Test", () => {
  const s3FileManager = new AWSS3FileManager({
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_S3_ACCESS_KEY,
    secretKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  })

  test("parseExt", () => {
    const ext = s3FileManager.parseExt("something.txt")
    expect(ext).toBe("txt")
  })

  test("get presignedUrl", async () => {
    const presignedUrl = await s3FileManager.getPresignedUrl("abc.txt")
    console.log("presignedUrl: ", presignedUrl)
  })

  test("upload file with presignedUrl", async () => {
    const presignedUrl = await s3FileManager.getPresignedUrl("abc.txt")

    const uploadResponse = await fetch(presignedUrl.presignedUrl, {
      method: "PUT",
      body: "dummy text",
      headers: {
        "Content-Type": "binary/octet-stream",
      },
    })

    const uploadedText = await (await s3FileManager.load("abc")).text()

    expect(uploadedText).toBe("dummy text")

    expect(uploadResponse.status).toBe(200)
  })

  test("throw IllegalArgumentException when file ext is missing", () => {
    expect(() => s3FileManager.parseExt("abc")).toThrow(
      IllegalArgumentException,
    )
  })

  test("throw IllegalArgumentException when mime-type is invalid", async () => {
    return expect(s3FileManager.getPresignedUrl("abc.abc")).rejects.toThrow(
      IllegalArgumentException,
    )
  })
})
