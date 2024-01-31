import * as path from "path"
import * as fs from "fs"

export class FileUtils {
    static async loadFile(filename: string): Promise<Buffer> {
        const baseFilePath = process.env.ATTACHED_FILE_PATH
        const filePath = path?.resolve(baseFilePath, filename)

        return fs.readFileSync(filePath)
    }
}