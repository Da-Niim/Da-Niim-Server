import { BadRequestException } from "@nestjs/common"

export const parseFilePipeExceptionFactory = (error: string) => {
  console.log(error)

  return new BadRequestException(error)
}
