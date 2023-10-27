import { Controller, Get, UseInterceptors } from "@nestjs/common"
import { AppService } from "./app.service"
import { ApiResponse } from "@nestjs/swagger"
import { ConvertResponseFormatInterceptor } from "./common/interceptors/convertResponseFormat.interceptor"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseInterceptors(ConvertResponseFormatInterceptor)
  @ApiResponse({
    status: 200,
    description: "test",
  })
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
