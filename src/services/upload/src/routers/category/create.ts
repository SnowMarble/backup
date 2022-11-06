import { prisma, S3 } from "lib"

import type { Response } from "express"
import type { CreateCategoryType } from "interface/body"

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
