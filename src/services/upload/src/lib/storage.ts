import AWS from "aws-sdk"
import { config } from "lib"

interface UploadFileParam {
  data: Buffer
  key: string
}

export class S3 {
  private static s3: AWS.S3
  private static endpoint: AWS.Endpoint
  private static region: string
  private static bucket: string

  private static init() {
    S3.bucket =
      "backup-media" + (process.env.NODE_ENV === "production" ? "" : "-storage")
    S3.region = "gov-standard"
    S3.endpoint = new AWS.Endpoint("kr.object.gov-ncloudstorage.com")
    S3.s3 = new AWS.S3({
      endpoint: S3.endpoint,
      region: S3.region,
      credentials: {
        accessKeyId: config.NCP_ACCESS_KEY,
        secretAccessKey: config.NCP_SECRET_KEY,
      },
    })
  }

  public static async createFolder(name: string) {
    if (!S3.s3) {
      S3.init()
    }

    await S3.s3
      .putObject({
        Bucket: S3.bucket,
        Key: name,
      })
      .promise()
  }

  public static async uploadFile({
    data,
    key
  }: UploadFileParam) {
    if (!S3.s3) {
      S3.init()
    }

    await S3.s3
      .putObject({
        Key: key,
        Body: data,
        Bucket: S3.bucket,
        ACL: "public-read",
      })
      .promise()
  }

  public static async download(key: string) {
    if (!S3.s3) {
      S3.init()
    }

    return S3.s3
      .getObject({
        Key: key,
        Bucket: S3.bucket,
      })
      .createReadStream()
  }
}
