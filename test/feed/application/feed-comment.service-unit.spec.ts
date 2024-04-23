import { Types } from 'mongoose';
import { AddCommentCommand } from '../../../src/feed/application/command/add-comment.command';
import { Model } from 'mongoose';
import { FeedComment } from '../../../src/feed/domain/feed-comment.entity';
import { getModelToken } from '@nestjs/mongoose';
import { FeedCommentRepository } from '../../../src/feed/infra/feed-comment.repository';
import { FeedCommentService } from '../../../src/feed/application/feed-comment.service';
import { Test, TestingModule } from "@nestjs/testing"
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedCommentAddedEvent } from 'src/feed/event/feed-comment-added.event';

describe("FeedCommentService Unit Test", () => {
    let service: FeedCommentService
    let repository: FeedCommentRepository
    let eventEmitter = {
        emit: jest.fn().mockReturnValue(true)
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                FeedCommentService,
                FeedCommentRepository,
                {
                    provide: EventEmitter2,
                    useValue: eventEmitter
                },
                {
                    provide: getModelToken(FeedComment.name),
                    useValue: FeedComment.name
                }
            ]
        }).compile()

    
        service = moduleRef.get(FeedCommentService)
        repository = moduleRef.get(FeedCommentRepository)
        eventEmitter = moduleRef.get(EventEmitter2)
    });

    test("Add Comment", async () => {
        const userId = new Types.ObjectId()
        const feedId = new Types.ObjectId()

        const command: AddCommentCommand = {
            userId: userId,
            feedId: feedId,
            content: "content",
            userName: "username"
        }

        jest.spyOn(repository, "create").mockResolvedValue(FeedComment.create({
            userId: userId,
            feedId: feedId,
            content: "content",
            userName: "username"
        }));

        await service.addComment(command)

        // eventEmitter emit call parameter validation
        expect(eventEmitter.emit).toHaveBeenCalledWith("feed.commentAdded", new FeedCommentAddedEvent({
            feedId: feedId,
            userId: userId
        }))
    })

    test("Add comment failed__")
})