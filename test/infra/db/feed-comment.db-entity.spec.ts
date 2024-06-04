import { FeedComment } from "src/feed/domain/feed-comment.domain-entity"
import { Types } from "mongoose"
import { FeedCommentDBEntity } from "../../../src/feed/infra/db/feed-comment.db-entity"
describe("Feed Comment DB Entity Test", () => {
  test("Mapping DB Enttiy to Domain Enttiy", () => {
    const _id = new Types.ObjectId()
    const feedId = new Types.ObjectId()
    const parentId = new Types.ObjectId()
    const userId = new Types.ObjectId()

    const dbEntity = new FeedCommentDBEntity({
      _id: _id,
      feedId: feedId,
      parentId: parentId,
      userId: userId,
      content: "content",
      commentCount: 10,
      likeCount: 10,
      userName: "username",
    })

    const domainEntity = dbEntity.toDomain()

    expect(domainEntity._id).toBe(_id)
    expect(domainEntity.feedId).toBe(feedId)
    expect(domainEntity.parentId).toBe(parentId)
    expect(domainEntity.userId).toBe(userId)
    expect(domainEntity.content).toBe("content")
    expect(domainEntity.commentCount).toBe(10)
    expect(domainEntity.likeCount).toBe(10)
    expect(domainEntity.userName).toBe("username")
  })

  test("Mapping Domain Entity to DB Entity", () => {
    const _id = new Types.ObjectId()
    const feedId = new Types.ObjectId()
    const parentId = new Types.ObjectId()
    const userId = new Types.ObjectId()

    const domainEntity = new FeedComment({
      _id: _id,
      feedId: feedId,
      parentId: parentId,
      userId: userId,
      content: "content",
      commentCount: 10,
      likeCount: 10,
      userName: "username",
    })

    const dbEntity = FeedCommentDBEntity.fromDomain(domainEntity)

    expect(dbEntity._id).toBe(_id)
    expect(dbEntity.feedId).toBe(feedId)
    expect(dbEntity.parentId).toBe(parentId)
    expect(dbEntity.userId).toBe(userId)
    expect(dbEntity.content).toBe("content")
    expect(dbEntity.commentCount).toBe(10)
    expect(dbEntity.likeCount).toBe(10)
    expect(dbEntity.userName).toBe("username")
  })
})
