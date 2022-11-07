import { redis, prisma, HttpError } from "lib";

import type { Response } from "express";
import type { OnboardingFamilyCodeVerifyBody } from "interface/body";

export default async (req: OnboardingFamilyCodeVerifyBody, res: Response) => {
  const familyId = await redis.get(`familyCode:${req.body.code}`);

  if (!familyId) {
    throw new HttpError(400, "Invalid code", 'ERR_INVALID_CODE');
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: { familyid: +familyId },
  })

  const family = await prisma.family.findUnique({
    where: { id: +familyId },
    select: {
      name: true,
      users: {
        select: {
          name: true,
          picture: true,
        }
      }
    }

  })

  res.json(family);
}
