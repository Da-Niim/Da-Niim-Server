import { ApiProperty } from "@nestjs/swagger"

export class GetUserProfileInfoDto {
    @ApiProperty()
    name: string
    @ApiProperty()
    profileUrl?: string
    @ApiProperty()
    intro?: string
    @ApiProperty()
    postCount: number
    @ApiProperty()
    travelogCount: number
    @ApiProperty()
    followerCount: number
    @ApiProperty()
    followingCount: number
    
    constructor(data: {[P in keyof GetUserProfileInfoDto]: GetUserProfileInfoDto[P]}) {
        Object.assign(this, data)
    }
}