import { KakaoAPIClient } from "src/common/infra/api-client/kakao-api-client"

describe("Kakao API client test", () => {
  it("coord2Address", async () => {
    const kakaoApiClient = new KakaoAPIClient()
    const address = await kakaoApiClient.coord2Address(
      126.89811666666667,
      37.570286111111116,
    )

    console.log(address)
  })
})
