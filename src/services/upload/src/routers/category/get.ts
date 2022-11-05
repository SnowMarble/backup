import { prisma } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const category = await prisma.category.findMany({
    where: { familyId: req.user.familyid as number },
    select: { id: true, name: true },
  })
  res.json(category)
}
