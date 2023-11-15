import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { Sample, SampleSchema } from "./sample.model"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        let mongoUri: string
        if (process.env.NODE_ENV === "dev") {
          mongoUri = configService.get<string>("MONGO_URI")
        } else {
          const mongod = await MongoMemoryServer.create() // new MongoMemoryServer()는 에러 발생함
          mongoUri = mongod.getUri()
        }
        console.log(`Connected to ${mongoUri}!`)
        return {
          uri: mongoUri,
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
