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
    DatabaseModule,
    UserModule,
    AuthModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
