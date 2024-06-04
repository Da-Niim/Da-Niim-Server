import { Type } from "@nestjs/common"
import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators"
import { ApiExtraModels } from "@nestjs/swagger/dist/decorators/api-extra-models.decorator"
import { ApiOkResponse } from "@nestjs/swagger/dist/decorators/api-response.decorator"
import { getSchemaPath } from "@nestjs/swagger/dist/utils/get-schema-path.util"
import { PaginationResponse } from "@types"

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  )
