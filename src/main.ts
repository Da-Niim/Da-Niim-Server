import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { GlobalExceptionFilter } from "./common/exceptions/base.exception.filter"
import { ValidationPipe } from "@nestjs/common"

declare const module: any
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["Authorization"], // * 사용할 헤더 추가.
  })
  const config = new DocumentBuilder()
    .setTitle("Da-Niim API")
    .setDescription("Da-Niim Server API for Da-Niim Web Service`")
    .setVersion("1.0")
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer", // I`ve tested not to use this field, but the result was the same
        scheme: "Bearer",
        type: "http", // I`ve attempted type: 'apiKey' too
        in: "Header",
      },
      "access-token",
    )
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
