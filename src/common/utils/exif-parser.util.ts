import * as path from "path"
import * as fs from "fs"
import { ExifParserFactory } from "ts-exif-parser"
import { FileUtils } from "./file.utils"

export class ExifParser {
  static async parseCoordFromSavedFile(filename: string): Promise<CoordDto> {
    const fileBuffer = await FileUtils.loadFile(filename)
    const data = ExifParserFactory.create(fileBuffer).parse()
    const lat = data.tags.GPSLatitude
    const lng = data.tags.GPSLongitude

    return {
      lat: lat,
      lng: lng,
    }
  }

  static async parseCoordFromMulterFile(file: Express.Multer.File): Promise<CoordDto> {
    const baseFilePath = process.env.ATTACHED_FILE_PATH
    const filePath = path?.resolve(baseFilePath, file.filename)

    const fileBuffer = fs.readFileSync(filePath)
    const data = ExifParserFactory.create(fileBuffer).parse()
    const lat = data.tags.GPSLatitude
    const lng = data.tags.GPSLongitude

    return {
      lat: lat,
      lng: lng,
    }
  }
}

export type CoordDto = {
  lng: number
  lat: number
}
