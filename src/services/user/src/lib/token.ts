import crypto from "crypto"
import config from "./config"
import jwt from "jsonwebtoken"
import { HttpError } from "lib/error"
// import { Prisma } from "@prisma/client"
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken"

interface Payload {
  id: string
  refresh: boolean
  onboarding: boolean
}

export const sha256 = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export const issue = (id: string, onboarding: boolean) => {
  return {
    accessToken: jwt.sign(
      { id, onboarding, refresh: false },
      config.jwtSecret,
      {
        expiresIn: config.jwtAccessLife,
      }
    ),
    refreshToken: jwt.sign(
      { id, onboarding, refresh: true },
      config.jwtSecret,
      {
        expiresIn: config.jwtRefreshLife,
      }
    ),
  }
}

export const getTokenType = () => { }

export const verify = (
  token: string | undefined,
  refresh: boolean
): Payload => {
  try {
    if (typeof token === "undefined") {
      throw new HttpError(401, "token required", "TOKEN_REQUIRED")
    }

    const payload = jwt.verify(token, config.jwtSecret) as Payload

    if (payload.refresh !== refresh) {
      throw new HttpError(
        401,
        "token type is not matched",
        "TOKEN_TYPE_MISMATCH"
      )
    }

    return payload
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new HttpError(401, "token is expired", "TOKEN_EXPIRED")
    }

    if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
      throw new HttpError(401, "token is not valid", "TOKEN_INVALID")
    }

    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   throw new HttpError(
    //     401,
    //     "fail to identify user",
    //     "TOKEN_FAILED"
    //   )
    // }

    throw error
  }
}
