export class PaginationResponse<T> {
    page: number
    size: number
    totalElements: number
    totalPage: number
    data: T

    constructor(page: number, size: number, totalElements: number, data: T) {
        this.page = page
        this.size = size
        this.totalElements = totalElements
        this.totalPage = (totalElements / size)
        this.data = data
    }
}