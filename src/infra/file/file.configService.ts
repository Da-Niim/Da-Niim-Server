import { S3Client } from "@aws-sdk/client-s3"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { MulterOptionsFactory } from "@nestjs/platform-express"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { diskStorage } from "multer"
import s3Storage from "multer-s3"
import { extname } from "path"
import { v4 as uuid } from "uuid"

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const options: MulterOptions = {
      fileFilter(req, file, callback) {
        isAcceptableMimeType(file.mimetype)
        callback(null, true)
      },
    }
    if (process.env.NODE_ENV == "prod") {
      options.storage = s3Storage({
        s3: new S3Client({
          region: this.configService.get("AWS_REGION"),
          credentials: {
            accessKeyId: this.configService.get("AWS_S3_ACCESS_KEY_ID"),
            secretAccessKey: this.configService.get("AWS_S3_SECREY_ACCESS_KEY"),
          },
        }),
        bucket: this.configService.get("AWS_S3_BUCKET"),
        contentType: s3Storage.AUTO_CONTENT_TYPE,
        metadata(req, file, callback) {
          callback(null, { owner: "it" })
        },
        key(req, file, callback) {
          const filename = `${uuid()}/${extname(file.originalname)}`
          callback(null, filename)
        },
      })
    } else {
      options.storage = diskStorage({
        destination: (req, file, callback) => {
          const dest = `${this.configService.get("ATTACHED_FILE_PATH")}`

          callback(null, dest)
        },
        filename: (req, file, callback) => {
          const filename = `${uuid()}${extname(file.originalname)}`
          callback(null, filename)
        },
      })
    }

    return options
  }
}

function isAcceptableMimeType(mimetype: string) {
  if (
    mimetype == "image/png" ||
    mimetype == "image/jpeg" ||
    mimetype == "image/jpg"
  )
    return
  //   throw new NotAcceptableMimeTypeException(mimetype)
}
