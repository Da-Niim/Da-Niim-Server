import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { UserGender } from "../const/user.gender.const"
import { Document } from "mongoose"

@Schema()
export class User extends Document {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  phoneNumber: string

  @Prop({ required: true, type: String, enum: UserGender })
  gender: UserGender

  @Prop({ required: true })
  birthDate: string
}

export const UserSchema = SchemaFactory.createForClass(User)
