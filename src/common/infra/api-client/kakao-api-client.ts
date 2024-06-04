import axios from "axios"
import { UrlBuilder } from "./url-build-util"

export class KakaoAPIClient {
  baseUrl: string = "https://dapi.kakao.com"
  apiKey: string = process.env.KAKAO_API_KEY

  async coord2Address(lng: number, lat: number): Promise<string> {
    const path = "/v2/local/geo/coord2address"
    const queryParams = {
      x: lng.toString(),
      y: lat.toString(),
      input_coord: "WGS84",
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: this.apiKey, // 예시: 실제 토큰으로 대체 필요
    }

    const url = new UrlBuilder().build(this.baseUrl, path, queryParams)
    console.log(url)
    const result = await axios.get(url, { headers: headers })

    return result.data.documents[0].address.address_name
  }
}
