import * as fs from "fs"
import * as path from "path"
import { ExifParserFactory } from "ts-exif-parser"

describe("exif-parser test", () => {
  it("parse", async () => {
    const filePath = path?.resolve(__dirname, "./resources")
    const contractFullPath = path.resolve(filePath, "IMG_8047.JPG")

    const fileBuffer = fs.readFileSync(contractFullPath)
    const data = ExifParserFactory.create(fileBuffer).parse()
    const lat = data.tags.GPSLatitude
    const lng = data.tags.GPSLongitude
    console.log(data)
    console.log(lat)
    console.log(lng)
  })
})
