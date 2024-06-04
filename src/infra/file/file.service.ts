import { GetPresignedUrlResponse } from "./GetPresignedUrlResponse.dto"
import { Inject, Injectable } from "@nestjs/common"
import { FileManager } from "./file.manager"

@Injectable()
export default class FileService {
  constructor(
    @Inject("fileManager") private readonly fileManager: FileManager,
  ) {}

  async preparePresignedUrlUpload(
    filename: string,
  ): Promise<GetPresignedUrlResponse> {
    return await this.fileManager.getPresignedUrl(filename)
  }
}
