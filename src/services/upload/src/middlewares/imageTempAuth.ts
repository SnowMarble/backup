import { redis, HttpError } from "lib"
import { identity } from "app"

import type { Request, Response, NextFunction } from "express"

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.a) {
    return identity(req, res, next)
  }

  const verifiedKey = await redis.get(req.query.a as string)
  if (req.params.key === verifiedKey) {
    req.familyid = +(req.query.f as string)
    return next()
  }

  throw new HttpError(401, "Unauthorized Code", "ERR_UNAUTHORIZED_CODE")
}
