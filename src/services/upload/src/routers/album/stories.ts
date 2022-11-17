import {
  prisma,
  HttpError,
  baseurl,
  userInfo,
  imageTempCode,
  thumbnail,
  updateAlbumView,
} from "lib"

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
      thumbnail: true,
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
      return {
        ...story,
        image: await imageTempCode(story.image, req.user.familyid as number),
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

  await updateAlbumView(album.id)

  res.json({
    ...album,
    thumbnail: album.thumbnail.startsWith("_d-")
      ? thumbnail.defaultImages[+album.thumbnail.substring(3)]
      : await imageTempCode(album.thumbnail, req.user.familyid as number),
    contributors,
    Story: stories,
  })
}
