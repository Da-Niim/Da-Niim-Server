import { ApiProperty } from "@nestjs/swagger"

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
        this.totalPage = Math.floor(totalElements / size)
        this.data = data
    }
}