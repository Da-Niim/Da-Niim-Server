import { validate } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { GetProfileFeedRequest } from './../../../../src/feed/controller/dto/get-profile-feed.dto';
describe("GetProfileFeedRequest", () => {
    it("'target' should not be emtpy", async () => {
        const req = new GetProfileFeedRequest()
        const errors = await validate(req)

        const targetIdValidationError = errors[0]
            
        expect(errors.length).toBe(1)
        expect(targetIdValidationError.property).toBe("target")
    })
});