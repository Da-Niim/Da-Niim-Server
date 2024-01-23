import { CoordDto } from "src/common/utils/exif-parser.util"

export interface AddressResolver {
  resolveCoord(file: Express.Multer.File): Promise<CoordDto>
  resolveAddress(coord: CoordDto): Promise<string>
}
