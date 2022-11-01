import { OAuth2Client } from "google-auth-library"
import { prisma, config, random, issue as issueToken, HttpError } from "lib"

import type { Response } from "express"
import type { LoginBody } from "interface/body"

const googleOAuth2Client: OAuth2Client = new OAuth2Client()

const getPayload = async (idToken: string) => {
  const payload = (
    await googleOAuth2Client.verifyIdToken({
      idToken,
      audience: config.googleClientIds,
    })
  ).getPayload()

  if (typeof payload === "undefined") {
    throw new HttpError(400, "invalid id token", "ERR_INVALID_ID_TOKEN")
  }

  return payload
}

export default async (req: LoginBody, res: Response) => {
  const payload = await getPayload(req.body.idToken)

  let user = await prisma.user.findUnique({
    where: {
      googleId: payload.sub,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: random(6),
        googleId: payload.sub,
        email: payload.email,
        picture: payload.picture || null,
      },
    })
  }

  res.json({
    onbaording: user.isOnboarding,
    token: issueToken(user.id + "", user.isOnboarding),
  })
}
