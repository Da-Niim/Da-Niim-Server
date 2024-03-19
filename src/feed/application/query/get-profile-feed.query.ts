import { Types } from "mongoose";

export class GetProfileFeedQuery {
    page: number
    size: number
    userId: Types.ObjectId
    target: Types.ObjectId

    constructor(data: {userId: Types.ObjectId, target: Types.ObjectId, page: number, size: number}) {
        this.userId = data.userId
        this.target = data.target ? data.target : data.userId
        this.page = data.page
        this.size = data.size
    }
}