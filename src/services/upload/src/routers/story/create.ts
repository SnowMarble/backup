import { prisma, HttpError } from 'lib'

import type { Response } from 'express';
import type { CreateStory } from 'interface/body';

export default async (req: CreateStory, res: Response) => {
  const album = await prisma.album.findFirst({
    where: {
      id: req.body.albumId,
      familyId: req.user.familyid as number,
    }
  })

  if (!album) {
    throw new HttpError(404, 'Album not found', 'ERR_ALBUM_NOT_FOUND')
  }

  const story = await prisma.story.create({
    data: {
      userId: req.user.id,
      image: req.body.image,
      AlbumId: req.body.albumId,
      description: req.body.description,
      familyId: req.user.familyid as number,
    },
    select: {
      id: true,
      image: true,
      description: true,
      createdAt: true
    }
  })

  res.json(story)
}
