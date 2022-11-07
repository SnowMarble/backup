import { S3, HttpError } from "lib"
import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const familyid = req.user ? req.user.familyid : req.familyid
  const result = await S3.download(`${familyid}/${req.params.key}`)
  result.pipe(res)
}
