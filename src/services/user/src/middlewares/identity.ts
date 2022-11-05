import { verify, amqp, prisma, HttpError } from "lib"

import type { Request, Response, NextFunction } from "express"

export const checkIdentity = async (token: string) => {
  const { id } = verify(token, false)

  const user = await prisma.user.findUnique({
    where: { id: +id },
  })

  if (!user) {
    throw new HttpError(401, "invalid token", "ERR_INVALID_TOKEN")
  }

  return user
}

export default async (req: Request, res: Response, next: NextFunction) => {
  req.user = await checkIdentity(req.token as string)

  return next()
}
