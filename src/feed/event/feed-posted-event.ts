import { Types } from "mongoose";

export class FeedPostedEvent {
    userId: Types.ObjectId

    constructor(data: {userId: Types.ObjectId}) {
        this.userId = data.userId
    }
}