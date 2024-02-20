import { AbstractFile } from "src/common/abstract.file.model"
import { FileType } from "src/common/file-type.enum"
import { FileUtils } from "src/common/utils/file.manager"

export class Photo extends AbstractFile {
  constructor(originalFileName: string, storedFileName: string) {
    super()
    this.originalFileName = originalFileName
    this.storedFileName = storedFileName
    this.type = FileType.PHOTO
  }

  static async of(destDir: string, files: Express.Multer.File[], fileUtils: FileUtils): Promise<Photo[]> {
    if(files.length > 0) {
      return Promise.all(files.map(async (f) => {
        const storedFileName = await fileUtils.save(f, destDir)
        return new Photo(f.originalname, storedFileName)
      }))
    } else {
      return null
    }
  }
}
