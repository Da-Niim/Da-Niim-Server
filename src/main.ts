import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { GlobalExceptionFilter } from "./common/exceptions/base.exception.filter"
import { ValidationPipe } from "@nestjs/common"
import { BodyInterceptor } from "./common/interceptors/bodyFieldParse.interceptor"

declare const module: any
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new BodyInterceptor())
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const config = new DocumentBuilder()
    .setTitle("Da-Niim API")
    .setDescription("Da-Niim Server API for Da-Niim Web Service`")
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)
  await app.listen(8080)
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()
