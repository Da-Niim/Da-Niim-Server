import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Sample } from "./sample.model"

@Injectable()
export class AppService {
  constructor(@InjectModel(Sample.name) private sampleModel: Model<Sample>) {}

  getHello(): string {
    return "Hello World!"
  }

  save(name: string) {
    const model = new this.sampleModel({
      id: new Types.ObjectId(),
      name: name,
    })
    model.save()
    console.log(model)
  }

  findById(id: Types.ObjectId) {
    const model = this.sampleModel.findById(id)
    console.log(model)
  }
}
