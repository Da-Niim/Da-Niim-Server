import { Injectable } from "@nestjs/common"
import { KakaoAPIClient } from "src/common/api-client/kakao-api-client"
import { CoordDto, ExifParser } from "src/common/utils/exif-parser.util"
import { AddressResolver } from "../domain/address-resolver.service"

@Injectable()
export class AddressResolverImpl implements AddressResolver {
  async resolveCoord(file: Blob): Promise<CoordDto> {
    return await ExifParser.parseCoordFromFile(file)
  }
  async resolveAddress(coord: CoordDto): Promise<string> {
    return await new KakaoAPIClient().coord2Address(coord.lng, coord.lat)
  }
}
