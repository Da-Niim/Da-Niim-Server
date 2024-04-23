import { AbstractFile } from "src/common/abstract.file.model"
import { FileType } from "src/common/file-type.enum"
import { FileManager } from "src/infra/file/file.manager"

export class Photo extends AbstractFile {
  constructor(originalFileName: string, storedFileName: string) {
    super()
    this.originalFileName = originalFileName
    this.storedFileName = storedFileName
    this.type = FileType.PHOTO
  }

  static async of(destDir: string, files: Express.Multer.File[], fileManager: FileManager): Promise<Photo[]> {
    if(files.length > 0) {
      return Promise.all(files.map(async (f) => {
        const storedFileName = await fileManager.save(f, destDir)
        return new Photo(f.originalname, storedFileName)
      }))
    } else {
      return null
    }
  }
}
