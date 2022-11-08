import crypto from "crypto"
import { prisma, redis, HttpError, baseurl, userInfo } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
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
          userId: true,
          createdAt: true,
          description: true,
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

  const contributorIds = new Set(stories.map((story) => story.userId))
  const contributors = await Promise.all(
    [...contributorIds].map(async (id) => {
      const user = await userInfo(id)
      return {
        id: user.id,
        name: user.name,
        picture: user.picture,
      }
    })
  )


  res.json({
    ...album,
    contributors,
    Story: stories,
  })
}
