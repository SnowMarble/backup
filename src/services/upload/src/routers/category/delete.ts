import { prisma } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  await prisma.category.deleteMany({
    where: {
      id: req.body.id as number,
      familyId: req.body.familyId,
    },
  })

  res.sendStatus(200)
}
