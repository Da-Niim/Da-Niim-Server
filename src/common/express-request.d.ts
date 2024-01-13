declare namespace Express {
  export interface Request {
    user?: User
    token?: Token
  }
}
