import { ArgumentMetadata, PipeTransform } from "@nestjs/common"
import { FeedPostDto } from "./feed-post.dto"

export class JsonBodyBindingPipe implements PipeTransform<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata) {
    return FeedPostDto.fromJsonString(value)
  }
}
