import { CoordDto } from "src/common/utils/exif-parser.util"

export interface AddressResolver {
  resolveCoord(file: Blob): Promise<CoordDto>
  resolveAddress(coord: CoordDto): Promise<string>
}
