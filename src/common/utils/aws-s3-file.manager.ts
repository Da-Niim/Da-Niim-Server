import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { FileManager } from "./file.manager";
import { v4 as uuid } from "uuid"

@Injectable()
export class AWSS3FileManager implements FileManager {
    s3Client: S3Client

    constructor() {
        const REGION = process.env.AWS_REGION
        const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY
        const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY

        this.s3Client = new S3Client({
            region: REGION, // AWS Region
            credentials: {
              accessKeyId: AWS_S3_ACCESS_KEY, // Access Key
              secretAccessKey: AWS_S3_SECRET_ACCESS_KEY, // Secret Key
            },
          });
    }

  getPublicUrl(filename: string, srcDir: string): Promise<string> {
    return new Promise((resolve, reject) => { resolve(this.buildPublicUrl(`${srcDir}/${filename}`)) })
  }

  async load(filename: string, srcDir: string): Promise<Blob> {
    const command = new GetObjectCommand({
      Bucket: "daniim-bucket",
      Key: `${srcDir}/${filename}`
    })

    const response = await this.s3Client.send(command);
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

    await this.s3Client.send(command)

    return storedFileName 
  }
  createStoredFileName(originalname: string): string {
    const ext = originalname.split(".")[1]

    return `${uuid()}.${ext}`  
  }
  
  buildPublicUrl(fileName: string): string {
    return `https://daniim-bucket.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }
}