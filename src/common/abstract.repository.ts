import { Logger, NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import {
  Connection,
  FilterQuery,
  FlattenMaps,
  Model,
  Require_id,
  SaveOptions,
  Types,
  UpdateQuery,
} from "mongoose"
import { filter } from "rxjs"
import { AbstractDocument } from "./abstract.schema"
import { DocumentNotFoundException } from "./exceptions/not-found.exception"

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(
    document: Omit<TDocument, "_id">,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    })

    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument
  }

  async findOne(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOne(filterQuery, {}, { lean: true })
    return document
  }

  async getOne(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOne(filterQuery, {}, { lean: true })

    if (!document) {
      this.logger.warn("Document not found with filterQuery", filterQuery)
      throw new DocumentNotFoundException("Document not found.")
    }

    return document
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    })

    if (!document) {
      this.logger.warn("Document not found with filterQuery", filterQuery)
      throw new DocumentNotFoundException("Document not found.")
    }

    return document
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    })
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true })
  }
  
  async findWithPagination(page: number, size: number, filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true})
    .limit(size)
    .skip(page * size)
  }

  async count(filterQuery: FilterQuery<TDocument>) {
    return this.model.countDocuments(filterQuery)
  }

  async exists(filterQuery: FilterQuery<TDocument>) {
    return this.model.exists(filterQuery)
  }

  async delete(filterQuery: FilterQuery<TDocument>) {
    return this.model.deleteOne(filterQuery, {})
  }

  async stratTransaction() {
    const session = await this.connection.startSession()
    session.startTransaction()
    return session
  }
}
