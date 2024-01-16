import { ExifParser } from "src/common/utils/exif-parser.util"

describe("Exif Parser", () => {
  it("parseCoord", async () => {
    const coord = ExifParser.parseCoordFromSavedFile("IMG_8047.JPG")

    console.log(coord)
  })
})
