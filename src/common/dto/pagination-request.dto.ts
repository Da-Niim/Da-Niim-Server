import { ApiProperty } from "@nestjs/swagger"

export class PaginationRequest {
    @ApiProperty()
    page: number = 0
    @ApiProperty()
    size: number = 14
}