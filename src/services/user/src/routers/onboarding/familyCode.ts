import { prisma } from 'lib'

import type { Response } from "express"
import type { OnboardingFamilyCodeBody } from "interface/body"

export default async (req: OnboardingFamilyCodeBody, res: Response) => {
  // await prisma.user.update({
  //   where: { id: req.user.id },
  //   data: {

  //   }
  // }) 
}
