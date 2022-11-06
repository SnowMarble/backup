import sharp from 'sharp';
import crypto from 'crypto';
import { S3, HttpError } from "lib"

import type { Request, Response } from "express"

export const upload = async (req: Request, res: Response) => {
  const { file } = req

  if (!file) {
    throw new HttpError(400, "no file", "ERR_NO_FILE")
  }

  const imageName = crypto.randomBytes(16).toString("hex")

  const image = await sharp(file.buffer).resize(500).toBuffer()

  await S3.uploadFile({
    key: `${req.user.familyid}/${imageName}`,
    data: image,
  })

  res.json({ key: imageName })
}
