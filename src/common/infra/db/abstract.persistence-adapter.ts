import { Types } from "mongoose"
import { AbstractRepository } from "src/common/abstract.repository"
import { AbstractDocument } from "src/common/abstract.schema"

export abstract class AbstractPersistenceAdapter<
  T,
  D extends AbstractDocument,
  R extends AbstractRepository<D>,
> {
  constructor(private readonly repository: R) {}

  getById(id: Types.ObjectId): Promise<T> {}
}
