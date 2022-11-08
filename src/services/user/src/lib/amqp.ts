import config from "./config"
import amqplib from "amqplib"
import { prisma } from './prisma'
import { HttpError } from "./error"
import { checkIdentity } from "middlewares/identity"

export class RabbitMQ {
  private static connection: amqplib.Connection
  private static userInfoReplyChannel: amqplib.Channel

  private static async connect() {
    return await amqplib.connect(config.rabbitMQURI)
  }

  public static async createChannel() {
    if (!RabbitMQ.connection) {
      RabbitMQ.connection = await RabbitMQ.connect()
    }

    return RabbitMQ.connection.createChannel()
  }

  public static async userIdentity() {
    const queue = "user-identity"
    const channel = await RabbitMQ.createChannel()

    await channel.assertQueue(queue)
    channel.consume(queue, async (msg) => {
      if (!msg) {
        return
      }

      try {
        const token = msg.content.toString()
        const identity = await checkIdentity(token)

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ data: identity })),
          { correlationId: msg.properties.correlationId }
        )
      } catch (error) {
        if (error instanceof HttpError) {
          const errorResponse = {
            code: error.code,
            status: error.status,
            message: error.message,
          }

          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify({ error: errorResponse })),
            { correlationId: msg.properties.correlationId }
          )
        } else {
          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify({ error: "error" })),
            { correlationId: msg.properties.correlationId }
          )
        }
      } finally {
        channel.ack(msg)
      }
    })
  }

  public static async userInfoReply() {
    const queue = "user-info"

    if (!RabbitMQ.userInfoReplyChannel) {
      RabbitMQ.userInfoReplyChannel = await RabbitMQ.createChannel()
      await RabbitMQ.userInfoReplyChannel.assertQueue(queue)
    }

    RabbitMQ.userInfoReplyChannel.consume(queue, async (msg) => {
      if (!msg) {
        return
      }

      const userId = +msg.content.toString()
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      RabbitMQ.userInfoReplyChannel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(user)),
        {
          correlationId: msg.properties.correlationId,
        }
      )
      RabbitMQ.userInfoReplyChannel.ack(msg)
    })
  }
}
