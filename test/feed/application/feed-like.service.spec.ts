import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AlreadyLikedFeedException } from './../../../src/feed/exception/already-like-feed.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { FeedLikeService } from './../../../src/feed/application/feed-like.service';
import { FeedLikeRepository } from './../../../src/feed/infra/feed-like.repository';
import { Test, TestingModule } from "@nestjs/testing"
import { FeedLike } from 'src/feed/domain/feed-like.entity';
import { FeedLikedEvent } from 'src/feed/event/feed-liked.event';

describe("FeedLikeService", () => {
    let service: FeedLikeService;
    let repository: FeedLikeRepository;
    let model: Model<FeedLike>
    let eventEmitter2 = {
        emit: jest.fn().mockResolvedValue(true)
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(FeedLike.name),
                    useValue: Model
                },
                FeedLikeRepository,
                FeedLikeService,
                {
                    provide: EventEmitter2,
                    useValue: eventEmitter2
                }
            ],
        }).compile()

        model = module.get(getModelToken(FeedLike.name))
        service = module.get(FeedLikeService)
        repository = module.get(FeedLikeRepository)
    })


    it("likeFeed() should throw AlreadyLikedFeedException if exists", async () => { 
        const createSpy = jest.spyOn(repository, 'create').mockResolvedValue(null)
        const spy = jest.spyOn(repository, 'findOne').mockResolvedValue(
            {
                _id: new Types.ObjectId(),
                feedId: new Types.ObjectId(),
                userId: new Types.ObjectId()
            }
        )
        const feedId = new Types.ObjectId()
        const userId = new Types.ObjectId()
    
        const feedLike = await repository.create({
            feedId: feedId,
            userId: userId
        })

        await expect(service.likeFeed(userId, feedId)).rejects.toThrow(AlreadyLikedFeedException)
    })

    it("likeFeed() success", async () => {
        const _id = new Types.ObjectId()
        const feedId = new Types.ObjectId()
        const userId = new Types.ObjectId()
    
        const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(null)
        const createSpy = jest.spyOn(repository, 'create').mockResolvedValue({
            _id: _id,
            feedId: feedId,
            userId: userId
        });

        await service.likeFeed(userId, feedId)
        
        expect(createSpy).toBeCalledWith({
            userId: userId,
            feedId: feedId
        })
        expect(eventEmitter2.emit).toHaveBeenCalledWith("feed.liked", new FeedLikedEvent({
            feedId: feedId,
            userId: userId
        }))
    })

    it("should not call eventemitter emit when deleted nothing", async () => {
        const deleteSpy = jest.spyOn(repository, 'delete').mockResolvedValue({
            deletedCount: 0,
            acknowledged: true
        })

        await service.cancelLikeFeed({
            userId: new Types.ObjectId(),
            feedId: new Types.ObjectId()
        })

        expect(eventEmitter2.emit).not.toHaveBeenCalledWith({
            event: "feed.likeCanceled"
        })
    })
})