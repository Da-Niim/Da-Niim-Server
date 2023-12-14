import { FileType } from "./file-type.enum"

export abstract class AbstractFile {
  originalFileName: string
  storedFileName: string
  type: FileType
}
