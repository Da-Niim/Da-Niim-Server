import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { NotAcceptableMimeTypeException } from "./file.exception"

@Injectable()
export class ImageFileValidationPipe
  implements PipeTransform<Express.Multer.File>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value.mimetype.match("image/*"))
      throw new NotAcceptableMimeTypeException(value.mimetype)
  }
}
