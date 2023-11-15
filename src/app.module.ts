import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { Sample, SampleSchema } from "./sample.model"

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create() // new MongoMemoryServer()는 에러 발생함
        const mongoUri = mongod.getUri()
        return {
          uri: mongoUri,
        }
      },
    }),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
