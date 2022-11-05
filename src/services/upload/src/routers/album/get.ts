import { prisma } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {

  const { sortType, sort = "asc" } = req.query

  const album = await prisma.album.findMany({
    where: { familyId: req.user.familyid as number },
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      // createdAt: sort as "asc" | "desc",
      [sortType as string]: sort as "asc" | "desc",
    }
  })
  res.json(album)
}
