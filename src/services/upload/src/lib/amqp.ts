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

    const defaultCategories = ['Daily', 'Special']

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
