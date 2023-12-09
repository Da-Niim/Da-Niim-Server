import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { FileModule } from "./infra/file/file.module"
import { Sample, SampleSchema } from "./sample.model"
import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),

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
          uri: "mongodb://nest:nest@localhost:27017",
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
