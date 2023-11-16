import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type SampleDocument = HydratedDocument<Sample>

@Schema()
export class Sample {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId

  @Prop(String)
  name: string
}

export const SampleSchema = SchemaFactory.createForClass(Sample)
