import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { NotAcceptableMimeTypeException } from "./file.exception"

@Injectable()
export class MultiImageFileValidationPipe
  implements PipeTransform<UploadFileMulti>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: UploadFileMulti, metadata: ArgumentMetadata) {
    const files = Object.values(value).flat()
    files.forEach((f) => {
      if (!f.mimetype.match("image/*"))
        throw new NotAcceptableMimeTypeException(f.mimetype)
    })

    return value
  }
}
