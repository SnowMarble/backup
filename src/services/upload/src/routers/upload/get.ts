import { S3 } from "lib"
import type { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const result = await S3.download(`${req.user.familyid}/${req.params.key}`)
  result.pipe(res)
}
