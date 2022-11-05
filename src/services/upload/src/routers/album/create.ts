import { prisma } from "lib"

import type { Response } from "express"
import type { CreateAlbum } from "interface/body"

export default async (req: CreateAlbum, res: Response) => {
  console.log(req.user)
  const album = await prisma.album.create({
    data: {
      name: req.body.name,
      evnetDate: new Date(req.body.eventDate),
      description: req.body.description,
      familyId: req.user.familyid as number,
      Category: { connect: { id: req.body.categoryId } },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  res.json(album)
}
