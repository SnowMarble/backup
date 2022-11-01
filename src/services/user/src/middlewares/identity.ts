import { verify, prisma, HttpError } from "lib"

import type { Request, Response, NextFunction } from "express"

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id } = verify(req.token, false)

  const user = await prisma.user.findUnique({
    where: { id: +id },
  })

  if (!user) {
    throw new HttpError(401, "invalid token", "ERR_INVALID_TOKEN")
  }

  req.user = user

  return next()
}
