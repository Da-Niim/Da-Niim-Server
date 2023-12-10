import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common"
import { Request, Response } from "express"
import { BaseException } from "./base.exception"

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    if (
      !(
        exception instanceof BaseException || exception instanceof HttpException
      )
    ) {
      console.log("exception: " + exception)
      throw new InternalServerErrorException("Uncatchable Error.")
    }

    const response = (exception as BaseException).getResponse()

    console.log("exception response: " + response)

    const log = {
      timestamp: new Date(),
      url: req.url,
      response: response,
      stack: (exception as HttpException).stack,
    }

    console.log("exception log: " + log)

    res.status((exception as BaseException).getStatus()).json({
      timestamp: new Date(),
      errorCode: (exception as BaseException).errorCode,
      path: req.url,
      detail: response,
    })
  }
}
