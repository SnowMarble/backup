import { redis } from "lib"
import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const userIssuedCode = await redis.get(`familyCodeIssuer:${req.user.id}`)
  if (userIssuedCode) {
    await redis.del(`familyCode:${userIssuedCode}`)
  }

  const code = Math.floor(Math.random() * 10 ** 6)
    .toString()
    .padStart(6, "0")

  await redis.set(`familyCode:${code}`, String(req.user.familyid), "EX", 60)
  await redis.set(`familyCodeIssuer:${req.user.id}`, code, "EX", 60)

  res.json({ code })
}
