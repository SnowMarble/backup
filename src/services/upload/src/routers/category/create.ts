import { prisma, amqp } from "lib"

import type { Request, Response } from "express"
import type { CreateCategoryType } from "interface/body"

interface MQCreateCategory {
  name: string
  familyid: number
}

export const createCategoryMQ = async () => {
  const connection = await amqp()
  const channel = await connection.createChannel()
  const queue = "create-category"

  const defaultCategories = ['Daily', 'Special']

  await channel.assertQueue(queue)
  channel.consume(queue, async (msg) => {
    if (!msg) return

    const category: MQCreateCategory = JSON.parse(msg.content.toString())
    for (const name of defaultCategories) {
      await createCategory(category.familyid, name)
    }

    channel.ack(msg)
  })
}

export const createCategory = async (familyId: number, name: string) => {
  return (
    await prisma.category.create({
      data: { name, familyId },
      select: { id: true },
    })
  ).id
}

export default async (req: CreateCategoryType, res: Response) => {
  const { name, familyId } = req.body
  const categoryId = await createCategory(familyId, name)

  res.json({ name, categoryId })
}
