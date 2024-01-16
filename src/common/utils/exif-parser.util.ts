import * as path from "path"
import * as fs from "fs"
import { ExifParserFactory } from "ts-exif-parser"

export class ExifParser {
  static parseCoordFromSavedFile(filename: string): CoordDto {
    const baseFilePath = process.env.ATTACHED_FILE_PATH
    const filePath = path?.resolve(baseFilePath, filename)

    const fileBuffer = fs.readFileSync(filePath)
    const data = ExifParserFactory.create(fileBuffer).parse()
    const lat = data.tags.GPSLatitude
    const lng = data.tags.GPSLongitude

    return {
      lat: lat,
      lng: lng,
    }
  }

  static parseCoordFromMulterFile(file: Express.Multer.File): CoordDto {
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
