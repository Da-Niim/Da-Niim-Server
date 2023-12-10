import { AbstractFile } from "src/common/abstract.file.model"
import { FileType } from "src/common/file-type.enum"

export class Photo extends AbstractFile {
  constructor(originalFileName: string, storedFileName: string) {
    super()
    this.originalFileName = originalFileName
    this.storedFileName = storedFileName
    this.type = FileType.PHOTO
  }

  static async of(files: Express.Multer.File[]): Promise<Photo[]> {
    return files.map((f) => {
      return new Photo(f.originalname, f.filename)
    })
  }
}
