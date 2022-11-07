import { prisma, HttpError } from 'lib'

import type { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      name: true,
      picture: true,
      family: {
        select: {
          name: true
        }
      }
    }
  })

  if (!user) {
    throw new HttpError(500, 'Can\'t find user', "ERR_NO_USER_FOUND")
  }

  const familyMemberCount = await prisma.user.count({
    where: { familyid: req.user.familyid as number }
  })

  res.json({
    ...user,
    family: {
      ...user.family,
      memberCount: familyMemberCount
    }
  })
}
