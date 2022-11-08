import { prisma } from "lib"

export const update = async (id: number): Promise<void> => {
  await prisma.album.update({
    where: { id },
    data: { lastViewed: new Date() },
  })
}
