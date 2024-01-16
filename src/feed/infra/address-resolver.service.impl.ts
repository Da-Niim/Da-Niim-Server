import { Injectable } from "@nestjs/common"
import { KakaoAPIClient } from "src/common/api-client/kakao-api-client"
import { CoordDto, ExifParser } from "src/common/utils/exif-parser.util"
import { AddressResolver } from "../domain/address-resolver.service"

@Injectable()
export class AddressResolverImpl implements AddressResolver {
  resolveCoord(file: Express.Multer.File): CoordDto {
    return ExifParser.parseCoordFromMulterFile(file)
  }
  async resolveAddress(coord: CoordDto): Promise<string> {
    return await new KakaoAPIClient().coord2Address(coord.lng, coord.lat)
  }
}
