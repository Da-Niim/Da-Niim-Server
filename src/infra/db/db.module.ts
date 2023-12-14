import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        let mongoUri: string
        switch (process.env.NODE_ENV) {
          case "dev":
            const mongod = await MongoMemoryServer.create() // new MongoMemoryServer()는 에러 발생함
            mongoUri = mongod.getUri()
            break
          default:
            mongoUri = configService.get<string>("MONGO_URI")
        }
        console.log(`Connected to ${mongoUri}!`)
        return {
          uri: mongoUri,
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
