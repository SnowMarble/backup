import { User } from "../generated/client"

export { }

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}
