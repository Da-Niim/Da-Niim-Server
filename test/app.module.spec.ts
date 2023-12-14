import { Injectable } from "@nestjs/common"
import {
  InjectModel,
  MongooseModule,
  MongooseModuleOptions,
  Prop,
  Schema,
  SchemaFactory,
} from "@nestjs/mongoose"
import { Test, TestingModule } from "@nestjs/testing"
import { MongoMemoryServer } from "mongodb-memory-server"
import { HydratedDocument, Model, Types } from "mongoose"

@Schema()
export class Sample {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId
  @Prop()
  name: string
}
export type SampleDocument = HydratedDocument<Sample>
export const SampleSchema = SchemaFactory.createForClass(Sample)

@Injectable()
export class SampleRepository {
  constructor(@InjectModel(Sample.name) private sampleModel: Model<Sample>) {}

  async save(sample: Sample): Promise<Sample> {
    const createdSample = new this.sampleModel(sample)
    return createdSample.save()
  }

  async findById(id: Types.ObjectId): Promise<Sample> {
    return this.sampleModel.findById(id)
  }
}

let mongod: MongoMemoryServer

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create() // new MongoMemoryServer()는 에러 발생함
      const mongoUri = await mongod.getUri()
      return {
        uri: mongoUri,
        ...options,
      }
    },
  })

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop()
}

describe("MongoDB 연결 테스트(mongodb-memory-server)", () => {
  let repository: SampleRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Sample.name, schema: SampleSchema },
        ]),
      ],
      providers: [SampleRepository],
    }).compile()

    repository = module.get<SampleRepository>(SampleRepository)
  })

  it("should successfully save mongoose model", async () => {
    const sampleData = {
      _id: new Types.ObjectId(),
      name: "이름",
    }

    const savedSample = await repository.save(sampleData)
    const find = await repository.findById(savedSample._id)

    console.log(find)

    // expect(repository.findById(savedSample.id)).toBe({
    //   id: savedSample.id,
    //   name: "이름",
    // })
  })

  afterEach(async () => {
    await closeInMongodConnection()
  })
})

// describe("MongoDB 연결 테스트(mongodb)", () => {
//   let repository: SampleRepository

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         MongooseModule.forRoot("mongodb://nest:nest@localhost:27017/"),
//         MongooseModule.forFeature([
//           { name: Sample.name, schema: SampleSchema },
//         ]),
//       ],
//       providers: [SampleRepository],
//     }).compile()

//     repository = module.get<SampleRepository>(SampleRepository)
//   })

//   it("should successfully save mongoose model", async () => {
//     const sampleData = {
//       _id: new Types.ObjectId(),
//       name: "이름",
//     }

//     const savedSample = await repository.save(sampleData)
//     const find = await repository.findById(savedSample._id)

//     console.log(find)
//   })
// })
