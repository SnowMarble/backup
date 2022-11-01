import { prisma } from "lib"

import type { Response } from "express"
import type { OnboardingFamilyBody } from "interface/body"

export default async (req: OnboardingFamilyBody, res: Response) => {
  const family = await prisma.family.create({
    data: { name: req.body.name },
  })

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      isOnboarding: false,
      familyid: family.id
    },
  })

  res.sendStatus(200)
}
