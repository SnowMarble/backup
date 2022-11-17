import { prisma, thumbnail, imageTempCode } from "lib"

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
      thumbnail: true,
      CategoryId: true,
      description: true,
    },
    orderBy: {
      [sortType as string]: sort as "asc" | "desc",
    },
  })

  res.json(
    await Promise.all(
      album.map(async (album) => ({
        ...album,
        thumbnail: album.thumbnail.startsWith("_d-")
          ? thumbnail.defaultImages[+album.thumbnail.substring(3)]
          : await imageTempCode(album.thumbnail, req.user.familyid as number),
      }))
    )
  )
}
