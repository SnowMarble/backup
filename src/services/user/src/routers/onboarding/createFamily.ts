import { RabbitMQ, prisma, HttpError } from "lib"

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
      familyid: family.id,
    },
  })

  const createCategoryQueue = "create-category"
  const channel = await RabbitMQ.createChannel()

  await channel.assertQueue(createCategoryQueue)
  channel.sendToQueue(
    createCategoryQueue,
    Buffer.from(JSON.stringify({ familyid: family.id }))
  )

  res.sendStatus(200)
}
