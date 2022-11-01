import { prisma } from 'lib'

import type { Response } from "express"
import type { OnboardingNameBody } from "interface/body"

export default async (req: OnboardingNameBody, res: Response) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { name: req.body.name }
  })

  res.sendStatus(200)
}
