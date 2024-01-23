import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { FeedModule } from "./feed/feed.module"
import { FileModule } from "./infra/file/file.module"
import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"
import { DatabaseModule } from "./infra/db/db.module"
import { FollowModule } from "./follow/follow.module"

@Module({
  imports: [
    FeedModule,
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),

    // MongooseModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => {
    //     let mongoUri: string
    //     switch (process.env.NODE_ENV) {
    //       case "dev":
    //         const mongod = await MongoMemoryServer.create({
    //           instance: { port: 27071 },
    //         }) // new MongoMemoryServer()는 에러 발생함
    //         mongoUri = mongod.getUri()
    //         break
    //       default:
    //         mongoUri = configService.get<string>("MONGO_URI")
    //     }
    //     console.log(`Connected to ${mongoUri}!`)
    //     return {
    //       uri: mongoUri,
    //     }
    //   },
    //   inject: [ConfigService],
    // }),
    DatabaseModule,
    UserModule,
    AuthModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
