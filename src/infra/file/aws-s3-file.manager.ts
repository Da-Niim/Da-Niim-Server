import { IllegalArgumentException } from "../../common/exceptions/illegal-argument.exception"
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { Inject, Injectable } from "@nestjs/common"
import { FileManager } from "./file.manager"
import { v4 as uuid } from "uuid"
import { ConfigType } from "@nestjs/config"
import s3Config from "../../common/config/s3Config"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import * as mime from "mime-types"

@Injectable()
export class AWSS3FileManager implements FileManager {
  s3Client: S3Client

  constructor(
    @Inject(s3Config.KEY)
    private readonly _s3Config: ConfigType<typeof s3Config>,
  ) {
    this.s3Client = new S3Client({
      region: _s3Config.region,
      credentials: {
        accessKeyId: _s3Config.accessKey,
        secretAccessKey: _s3Config.secretKey,
      },
    })
  }

  async getPresignedUrl(
    filename: string,
  ): Promise<{ presignedUrl: string; key: string }> {
    const mimeType = mime.lookup(this.parseExt(filename))
    if (!mimeType) throw new IllegalArgumentException("invalid mime-type")

    const command = new PutObjectCommand({
      Bucket: "daniim-bucket",
      Key: `/tmp/${filename}`, //TODO tmp에 있는 파일을 업로드 완료 후 photo 디렉토리로 이전
      ContentType: mimeType,
    })

    return {
      presignedUrl: await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      }),
      key: `/tmp/${filename}`,
    }
  }

  async load(filename: string): Promise<Blob> {
    const command = new GetObjectCommand({
      Bucket: "daniim-bucket",
      Key: `${filename}`,
    })

    const response = await this.s3Client.send(command)
    const data = await response.Body.transformToByteArray()
    return new Promise((resolve, reject) => resolve(new Blob([data])))
  }

  async save(file: Express.Multer.File, destDir: string): Promise<string> {
    const storedFileName = `${this.createStoredFileName(file.originalname)}`
    const command = new PutObjectCommand({
      Bucket: "daniim-bucket",
      Key: `${destDir}/${storedFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    const putObjectResult = await this.s3Client.send(command)
    return storedFileName
  }

  createStoredFileName(originalname: string): string {
    const ext = originalname.split(".")[1]
    return `${uuid()}.${ext}`
  }

  getPublicUrl(filename: string, pathDir: string): string {
    return `https://daniim-bucket.s3.${process.env.AWS_REGION}.amazonaws.com${pathDir}/${filename}`
  }

  parseExt(filename: string): string {
    const ext = filename.split(".")[1]

    if (!ext) throw new IllegalArgumentException("file ext is missing")
    return ext
  }
}
