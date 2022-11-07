import { prisma, redis } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {

  const { sortType, sort = "asc", categoryId } = req.query

  const album = await prisma.album.findMany({
    where: {
      familyId: req.user.familyid as number,
      CategoryId: categoryId ? +categoryId : undefined,
    },
    select: {
      id: true,
      name: true,
      CategoryId: true,
      description: true,
    },
    orderBy: {
      [sortType as string]: sort as "asc" | "desc",
    }
  })

  res.json(album)
}
