import { Types } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { AbstractDocument } from "src/common/abstract.schema"
import { BaseEntityMapper } from "./interface.entity-mapper"

export abstract class AbstractPersistenceAdapter<
  T,
  D extends AbstractDocument,
  R extends AbstractRepository<D>,
  M extends BaseEntityMapper<D, T>,
> {
  constructor(
    protected readonly repository: R,
    protected mapper: M,
    private dbEntityConstructor: new (...args: any[]) => D,
  ) {}

  async getById(id: Types.ObjectId): Promise<T> {
    const result = new this.dbEntityConstructor(
      await this.repository.getOne({ _id: id }),
    )
    return this.mapper.toDomainEntity(result)
  }

  async save(domain: T): Promise<T> {
    const savedDBEntity = await this.repository.create(
      new this.dbEntityConstructor(domain),
    )
    return this.mapper.toDomainEntity(savedDBEntity)
  }
}
