import crypto from "crypto"
import { prisma, redis, HttpError, baseurl } from "lib"

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
          name: true,
        },
      },
      name: true,
      evnetDate: true,
      description: true,
      Story: {
        select: {
          id: true,
          image: true,
          description: true,
          createdAt: true,
        },
      },
    },
  })

  if (!album) {
    throw new HttpError(404, "Not Found Album", "ERR_NOT_FOUND_ALBUM")
  }

  const stories = await Promise.all(
    album.Story.map(async (story) => {
      const tempAuthCode = crypto.randomBytes(16).toString("hex")
      await redis.set(tempAuthCode, story.image, "EX", 60 * 60)
      return {
        ...story,
        image: `${baseurl}/upload/${story.image}?&f=${req.user.familyid}&a=${tempAuthCode}`,
      }
    })
  )

  res.json({
    ...album,
    Story: stories,
  })
}
