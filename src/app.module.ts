import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { EventEmitterDynamicModule } from "./common/event-emitter.module"
import { FeedModule } from "./feed/feed.module"
import { FollowModule } from "./follow/follow.module"
import { DatabaseModule } from "./infra/db/db.module"
import { FileModule } from "./infra/file/file.module"
import { UserModule } from "./user/user.module"

@Module({
  imports: [
    FeedModule,
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : ".env",
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    FollowModule,
    EventEmitterDynamicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
