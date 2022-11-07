import { prisma } from "lib"
import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const members = await prisma.user.findMany({
    where: { familyid: req.user.familyid },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
    },
  })

  res.json({ members })
}
