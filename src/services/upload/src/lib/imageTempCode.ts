import { redis, baseurl } from "lib"
import crypto from "crypto"

export const imageTempCode = async (
  imageId: string,
  familyId: number
): Promise<string> => {
  const tempAuthCode = crypto.randomBytes(16).toString("hex")
  await redis.set(tempAuthCode, imageId, "EX", 60 * 60)
  return `${baseurl}/upload/${imageId}?&f=${familyId}&a=${tempAuthCode}`
}
