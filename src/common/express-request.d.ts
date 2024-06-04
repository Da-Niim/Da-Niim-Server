import { User } from "src/user/entity/user.entity"

declare module "express" {
  interface Request {
    user?: User
    token?: Token
    tokenType?: any
  }
}
