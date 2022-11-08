import crypto from "crypto"
import config from "./config"
import amqplib from "amqplib"
import { S3 } from "./storage"
import { HttpError } from "./error"
import { createCategory } from "routers/category/create"

import type { User } from "interface/user"

interface Identity {
  error?: {
    code: string
    message: string
    status: number
  }
  data?: User
}

interface MQCreateCategory {
  name: string
  familyid: number
}

export class RabbitMQ {
  private static connection: amqplib.Connection | null
  public static identityChannel: amqplib.Channel | null
  public static identityReplyHandlers = new Map<string, Function>()

  constructor() {
    RabbitMQ.connection = null
    RabbitMQ.identityChannel = null
  }

  private static async connect() {
    return await amqplib.connect(config.rabbitMQURI)
  }

  public static async createChannel() {
    if (!RabbitMQ.connection) {
      RabbitMQ.connection = await RabbitMQ.connect()
    }

    return RabbitMQ.connection.createChannel()
  }

  public static async userIdentityReply() {
    const queue = "user-identity-reply"
    // RabbitMQ.identityChannel = await RabbitMQ.createChannel()
    const channel = await RabbitMQ.createChannel()

    await channel.assertQueue(queue)
    channel.consume(queue, async (msg) => {
      if (!msg) {
        return
      }

      try {
        const identity: Identity = JSON.parse(msg.content.toString())

        if (identity.error) {
          throw new HttpError(
            identity.error.status,
            identity.error.message,
            identity.error.code
          )
        }

        if (identity.data) {
          const handler = RabbitMQ.identityReplyHandlers.get(
            msg.properties.correlationId
          )

          if (handler) {
            handler(identity)
          }
        }
      } catch (error) {
        if (error instanceof HttpError) {
          const handler = RabbitMQ.identityReplyHandlers.get(
            msg.properties.correlationId
          )

          if (handler) {
            handler(error)
          }
        }
      } finally {
        if (RabbitMQ.identityChannel) {
          RabbitMQ.identityChannel.ack(msg)
        }
      }
    })
  }

  public static async createDeaultCategories() {
    const queue = "create-category"
    const channel = await RabbitMQ.createChannel()

    const defaultCategories = ["Daily", "Special"]

    await channel.assertQueue(queue)
    channel.consume(queue, async (msg) => {
      if (!msg) return

      const user: MQCreateCategory = JSON.parse(msg.content.toString())
      for (const name of defaultCategories) {
        await createCategory(user.familyid, name)
      }

      await S3.createFolder(`${user.familyid}/`)

      channel.ack(msg)
    })
  }
}

let userInfoChannel: amqplib.Channel
const userInfoHandler = new Map<string, Function>()

export const userInfo = async (userId: number) => {
  const queue = "user-info"
  const replyQueue = "user-info-reply"

  if (!userInfoChannel) {
    userInfoChannel = await RabbitMQ.createChannel()
    await userInfoChannel.assertQueue(queue)
    await userInfoChannel.assertQueue(replyQueue)
    await userInfoChannel.consume(replyQueue, (msg) => {
      if (!msg) {
        return
      }

      const info: User = JSON.parse(msg.content.toString())
      const handler = userInfoHandler.get(msg.properties.correlationId)
      handler && handler(info)
      userInfoChannel.ack(msg)
    })
  }

  const correlationId = crypto.randomBytes(16).toString("hex")
  const promise = new Promise<User>((resolve) => {
    userInfoHandler.set(correlationId, resolve)
  })
  userInfoChannel.sendToQueue(queue, Buffer.from(userId.toString()), {
    correlationId,
    replyTo: replyQueue,
  })
  return promise
}
