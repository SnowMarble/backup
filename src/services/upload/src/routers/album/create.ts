import { prisma } from "lib"

import type { Response } from "express"
import type { CreateAlbum } from "interface/body"

export default async (req: CreateAlbum, res: Response) => {
  const album = await prisma.album.create({
    data: {
      name: req.body.name,
      evnetDate: new Date(req.body.eventDate),
      CategoryId: req.body.categoryId,
      familyId: req.user.familyid as number,
    },
    select: {
      id: true,
      name: true,
      description: true,
    }
  })

  res.json(album)
}
