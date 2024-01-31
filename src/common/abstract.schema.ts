import { Prop, Schema } from "@nestjs/mongoose"
import { Exclude } from "class-transformer"
import { SchemaTypes, Types } from "mongoose"

@Schema()
export abstract class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id?: Types.ObjectId
}
