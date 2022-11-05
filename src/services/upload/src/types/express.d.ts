import { User } from "interface/user"

export { }

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}
