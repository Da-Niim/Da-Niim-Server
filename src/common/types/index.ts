import { ApiProperty } from "@nestjs/swagger"

export type Pageable = {
  page: number
  size: number
}

export type PagenationInfo = {
  page: number
  size: number
  totalPages: number
  totalElements: number
}

export class PaginationRequest {
  @ApiProperty()
  page: number = 0
  @ApiProperty()
  size: number = 14
}

export class PaginationResponse<T> {
  @ApiProperty()
  page: number
  @ApiProperty()
  size: number
  @ApiProperty()
  totalElements: number
  @ApiProperty()
  totalPage: number
  data: T

  constructor(page: number, size: number, totalElements: number, data: T) {
    this.page = page
    this.size = size
    this.totalElements = totalElements
    this.totalPage = Math.ceil(totalElements / size)
    this.data = data
  }
}
