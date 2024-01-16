export class UrlBuilder {
  build(
    baseUrl: string,
    path: string,
    queryParams?: Record<string, string>,
  ): string {
    const urlBuilder = new URL(baseUrl)
    urlBuilder.pathname = path
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        urlBuilder.searchParams.append(key, value)
      })
    }

    return urlBuilder.href
  }
}
