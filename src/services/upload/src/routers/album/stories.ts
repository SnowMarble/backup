import { prisma, HttpError } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  // check album esists
  const album = await prisma.album.findFirst({
    where: {
      id: +(req.params.albumId as unknown as string),
      familyId: req.user.familyid as number,
    },
    select: {
      id: true,
      createdAt: true,
      Category: {
        select: {
          id: true,
          name: true
        }
      },
      name: true,
      evnetDate: true,
      description: true,
      Story: {
        select: {
          id: true,
          image: true,
          description: true,
          createdAt: true
        }
      }
    }
  })

  if (!album) {
    throw new HttpError(404, "Album not found", "ERR_ALBUM_NOT_FOUND")
  }

  res.json(album)
}
