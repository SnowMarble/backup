import { prisma, userInfo, imageTempCode } from "lib"

import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const now = new Date()
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const stories = await prisma.story.findMany({
    where: {
      familyId: req.user.familyid as number,
      createdAt: { gte: targetDate },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      image: true,
      userId: true,
      createdAt: true,
      description: true,
      Album: { select: { name: true } },
    },
  })

  const users = new Map()
  for (const story of stories) {
    if (users.has(story.userId)) {
      continue
    }

    const user = await userInfo(story.userId)
    users.set(story.userId, {
      id: user.id,
      name: user.name,
      picture: user.picture,
    })
  }

  res.json({
    users: Array.from(users.values()),
    story: await Promise.all(
      stories.map(async (story) => ({
        id: story.id,
        userId: story.userId,
        album: story.Album.name,
        createdAt: story.createdAt,
        description: story.description,
        image: await imageTempCode(story.image, req.user.familyid as number),
      }))
    ),
  })
}
