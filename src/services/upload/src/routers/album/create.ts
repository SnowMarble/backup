import { prisma, HttpError, thumbnail } from "lib"

import type { Response } from "express"
import type { CreateAlbum } from "interface/body"

export default async (req: CreateAlbum, res: Response) => {

  const familyCategories = await prisma.category.findMany({
    where: { familyId: req.user.familyid as number },
    select: { id: true }
  })

  if (!familyCategories.find(category => category.id === req.body.categoryId)) {
    throw new HttpError(400, "Category not found", "ERR_CATEGORY_NOT_FOUND")
  }

  const album = await prisma.album.create({
    data: {
      name: req.body.name,
      evnetDate: new Date(req.body.eventDate),
      description: req.body.description,
      familyId: req.user.familyid as number,
      CategoryId: req.body.categoryId,
      thumbnail: req.body.thumbnail || `_d-${thumbnail.randomIndex()}`,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  res.json(album)
}
